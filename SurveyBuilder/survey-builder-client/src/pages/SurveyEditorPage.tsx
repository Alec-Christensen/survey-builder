import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createSurvey, getSurvey, updateSurvey } from '../services/surveyService'
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '../services/questionService'
import { getOptions, createOption, updateOption, deleteOption } from '../services/optionService'
import { QuestionType } from '../types/question'
import Navbar from '../components/Navbar'
import './survey-editor.css'

interface EditorOption {
  id?: string
  text: string
}

interface EditorQuestion {
  id?: string
  text: string
  type: QuestionType
  isRequired: boolean
  options: EditorOption[]
}

export default function SurveyEditorPage() {
  const { id } = useParams()
  const isEditMode = !!id
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [questions, setQuestions] = useState<EditorQuestion[]>([])
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([])
  const [deletedOptionIds, setDeletedOptionIds] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(isEditMode)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEditMode) return
    async function load() {
      try {
        const [survey, qs] = await Promise.all([getSurvey(id!), getQuestions(id!)])
        setTitle(survey.title)
        setDescription(survey.description ?? '')
        setIsPublished(survey.isPublished)

        const editorQuestions = await Promise.all(
          qs.map(async (q) => {
            const needsOptions =
              q.type === QuestionType.SingleChoice || q.type === QuestionType.MultipleChoice
            const opts = needsOptions ? await getOptions(id!, q.id) : []
            return {
              id: q.id,
              text: q.text,
              type: q.type,
              isRequired: q.isRequired,
              options: opts.map((o) => ({ id: o.id, text: o.text })),
            }
          }),
        )
        setQuestions(editorQuestions)
      } catch {
        setError('Failed to load survey. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, isEditMode])

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      { text: '', type: QuestionType.Text, isRequired: false, options: [] },
    ])
  }

  function removeQuestion(idx: number) {
    const q = questions[idx]
    if (q.id) {
      setDeletedQuestionIds((prev) => [...prev, q.id!])
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx))
  }

  function updateQuestionField<K extends keyof EditorQuestion>(
    idx: number,
    field: K,
    value: EditorQuestion[K],
  ) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== idx) return q
        const updated = { ...q, [field]: value }
        if (field === 'type') {
          const newType = value as QuestionType
          if (newType !== QuestionType.SingleChoice && newType !== QuestionType.MultipleChoice) {
            if (q.id && q.options.length > 0) {
              const toDelete = q.options.filter((o) => o.id).map((o) => o.id!)
              if (toDelete.length > 0) {
                setDeletedOptionIds((prev) => ({
                  ...prev,
                  [q.id!]: [...(prev[q.id!] ?? []), ...toDelete],
                }))
              }
            }
            updated.options = []
          }
        }
        return updated
      }),
    )
  }

  function addOption(qIdx: number) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, options: [...q.options, { text: '' }] } : q)),
    )
  }

  function removeOption(qIdx: number, oIdx: number) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q
        const opt = q.options[oIdx]
        if (opt.id && q.id) {
          setDeletedOptionIds((prev2) => ({
            ...prev2,
            [q.id!]: [...(prev2[q.id!] ?? []), opt.id!],
          }))
        }
        return { ...q, options: q.options.filter((_, oi) => oi !== oIdx) }
      }),
    )
  }

  function updateOptionText(qIdx: number, oIdx: number, text: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.map((o, oi) => (oi === oIdx ? { ...o, text } : o)) }
          : q,
      ),
    )
  }

  function validate(): string | null {
    if (!title.trim()) return 'Survey title is required.'
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) return `Question ${i + 1} text is required.`
      if (
        (questions[i].type === QuestionType.SingleChoice ||
          questions[i].type === QuestionType.MultipleChoice) &&
        questions[i].options.length < 2
      ) {
        return `Question ${i + 1} must have at least 2 options.`
      }
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].text.trim()) {
          return `Question ${i + 1}, option ${j + 1} text is required.`
        }
      }
    }
    return null
  }

  async function handleSave() {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError(null)
    setSaving(true)
    try {
      if (!isEditMode) {
        await saveCreate()
      } else {
        await saveEdit()
      }
      navigate('/dashboard')
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save survey. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function saveCreate() {
    const survey = await createSurvey({ title: title.trim(), description: description.trim() || null })
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const savedQ = await createQuestion(survey.id, {
        text: q.text.trim(),
        type: q.type,
        order: i,
        isRequired: q.isRequired,
      })
      for (let j = 0; j < q.options.length; j++) {
        await createOption(survey.id, savedQ.id, { text: q.options[j].text.trim(), order: j })
      }
    }
  }

  async function saveEdit() {
    await updateSurvey(id!, {
      title: title.trim(),
      description: description.trim() || null,
      isPublished,
    })

    for (const qId of deletedQuestionIds) {
      try {
        await deleteQuestion(id!, qId)
      } catch (err: any) {
        const message = err?.response?.data?.message
        throw new Error(message ?? 'Failed to delete a question.')
      }
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      let questionId: string

      if (!q.id) {
        const savedQ = await createQuestion(id!, {
          text: q.text.trim(),
          type: q.type,
          order: i,
          isRequired: q.isRequired,
        })
        questionId = savedQ.id
      } else {
        await updateQuestion(id!, q.id, {
          text: q.text.trim(),
          type: q.type,
          order: i,
          isRequired: q.isRequired,
        })
        questionId = q.id
      }

      const toDeleteOpts = deletedOptionIds[q.id ?? ''] ?? []
      await Promise.all(toDeleteOpts.map((oId) => deleteOption(id!, questionId, oId)))

      for (let j = 0; j < q.options.length; j++) {
        const opt = q.options[j]
        if (!opt.id) {
          await createOption(id!, questionId, { text: opt.text.trim(), order: j })
        } else {
          await updateOption(id!, questionId, opt.id, { text: opt.text.trim(), order: j })
        }
      }
    }
  }

  const typeLabels: Record<QuestionType, string> = {
    [QuestionType.Text]: 'Text',
    [QuestionType.SingleChoice]: 'Single Choice',
    [QuestionType.MultipleChoice]: 'Multiple Choice',
    [QuestionType.Rating]: 'Rating',
  }

  return (
    <div className="editor-page">
      <Navbar
        primaryAction={{ label: saving ? 'Saving…' : 'Save Survey', onClick: handleSave }}
        secondaryAction={{ label: 'Cancel', onClick: () => navigate('/dashboard') }}
      />
      <div style={{ paddingTop: '32px' }}>
      {error && <div className="editor-error">{error}</div>}

      {loading ? (
        <div className="editor-status">Loading survey…</div>
      ) : (
        <>
          <div className="editor-section">
            <h2 className="editor-section-title">Survey Details</h2>
            <div className="form-group">
              <label htmlFor="survey-title">Title *</label>
              <input
                id="survey-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Customer Satisfaction Survey"
              />
            </div>
            <div className="form-group">
              <label htmlFor="survey-description">Description</label>
              <textarea
                id="survey-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description shown to respondents"
              />
            </div>
          </div>

          <div className="editor-section">
            <div className="editor-section-header">
              <h2>Questions</h2>
              <button className="btn btn-secondary" onClick={addQuestion}>
                Add Question
              </button>
            </div>

            {questions.length === 0 && (
              <p className="editor-empty">No questions yet. Click "Add Question" to get started.</p>
            )}

            {questions.map((q, idx) => (
              <div key={idx} className="question-card">
                <div className="question-card-header">
                  <span className="question-number">Q{idx + 1}</span>
                  <button className="btn btn-danger" onClick={() => removeQuestion(idx)}>
                    Remove
                  </button>
                </div>

                <div className="form-group">
                  <label>Question *</label>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => updateQuestionField(idx, 'text', e.target.value)}
                    placeholder="Enter your question"
                  />
                </div>

                <div className="question-meta">
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={q.type}
                      onChange={(e) =>
                        updateQuestionField(idx, 'type', Number(e.target.value) as QuestionType)
                      }
                    >
                      {(Object.values(QuestionType).filter((v) => typeof v === 'number') as QuestionType[]).map(
                        (t) => (
                          <option key={t} value={t}>
                            {typeLabels[t]}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={q.isRequired}
                      onChange={(e) => updateQuestionField(idx, 'isRequired', e.target.checked)}
                    />
                    Required
                  </label>
                </div>

                {(q.type === QuestionType.SingleChoice ||
                  q.type === QuestionType.MultipleChoice) && (
                  <div className="options-section">
                    <p className="options-label">Options</p>
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="option-row">
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => updateOptionText(idx, oIdx, e.target.value)}
                          placeholder={`Option ${oIdx + 1}`}
                        />
                        <button className="btn btn-danger" onClick={() => removeOption(idx, oIdx)}>
                          ×
                        </button>
                      </div>
                    ))}
                    <button className="btn btn-secondary" onClick={() => addOption(idx)}>
                      Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  )
}
