import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { getPublicSurvey, submitResponse } from '../services/publicSurveyService'
import { QuestionType } from '../types/question'
import type { PublicSurvey } from '../types/public'
import './public-survey.css'

interface AnswerState {
  textValue: string
  selectedOptionIds: string[]
}

function emptyAnswer(): AnswerState {
  return { textValue: '', selectedOptionIds: [] }
}

export default function PublicSurveyPage() {
  const { shareableCode } = useParams()

  const [survey, setSurvey] = useState<PublicSurvey | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    getPublicSurvey(shareableCode!)
      .then((data) => {
        setSurvey(data)
        const initial: Record<string, AnswerState> = {}
        data.questions.forEach((q) => { initial[q.id] = emptyAnswer() })
        setAnswers(initial)
      })
      .catch((err) => {
        if (isAxiosError(err) && err.response?.status === 404) {
          setNotFound(true)
        } else {
          setNotFound(true)
        }
      })
      .finally(() => setLoading(false))
  }, [shareableCode])

  function setTextValue(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: { ...prev[questionId], textValue: value } }))
  }

  function setSingleChoice(questionId: string, optionId: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { textValue: '', selectedOptionIds: [optionId] },
    }))
  }

  function toggleMultiChoice(questionId: string, optionId: string) {
    setAnswers((prev) => {
      const current = prev[questionId]?.selectedOptionIds ?? []
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
      return { ...prev, [questionId]: { textValue: '', selectedOptionIds: next } }
    })
  }

  function setRating(questionId: string, value: number) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { textValue: String(value), selectedOptionIds: [] },
    }))
  }

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {}
    if (!survey) return errors
    for (const q of survey.questions) {
      if (!q.isRequired) continue
      const answer = answers[q.id]
      if (q.type === QuestionType.Text) {
        if (!answer?.textValue.trim()) errors[q.id] = 'This question is required.'
      } else if (q.type === QuestionType.SingleChoice) {
        if (!answer?.selectedOptionIds.length) errors[q.id] = 'Please select an option.'
      } else if (q.type === QuestionType.MultipleChoice) {
        if (!answer?.selectedOptionIds.length) errors[q.id] = 'Please select at least one option.'
      } else if (q.type === QuestionType.Rating) {
        if (!answer?.textValue) errors[q.id] = 'Please select a rating.'
      }
    }
    return errors
  }

  async function handleSubmit() {
    const errors = validate()
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitError(null)
    setSubmitting(true)
    try {
      await submitResponse(shareableCode!, {
        answers: survey!.questions.map((q) => ({
          questionId: q.id,
          textValue: answers[q.id]?.textValue || null,
          selectedOptionIds: answers[q.id]?.selectedOptionIds ?? [],
        })),
      })
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="survey-page">
      <div className="survey-card">
        {loading && <div className="survey-status">Loading survey…</div>}

        {!loading && notFound && (
          <div className="survey-not-found">
            <h2>Survey not found</h2>
            <p>This link may be invalid or the survey is no longer available.</p>
          </div>
        )}

        {!loading && submitted && (
          <div className="survey-thankyou">
            <h2>Thank you for your response!</h2>
            <p>Your answers have been recorded.</p>
          </div>
        )}

        {!loading && survey && !submitted && (
          <>
            <h1 className="survey-title">{survey.title}</h1>
            {survey.description && (
              <p className="survey-description">{survey.description}</p>
            )}
            <hr className="survey-divider" />

            {survey.questions.map((q) => (
              <div key={q.id} className="question-block">
                <p className="question-text">
                  {q.text}
                  {q.isRequired && <span className="question-required"> *</span>}
                </p>

                {q.type === QuestionType.Text && (
                  <textarea
                    className="survey-textarea"
                    value={answers[q.id]?.textValue ?? ''}
                    onChange={(e) => setTextValue(q.id, e.target.value)}
                    placeholder="Your answer"
                  />
                )}

                {q.type === QuestionType.SingleChoice && (
                  <div className="choice-list">
                    {q.options.map((opt) => (
                      <label key={opt.id} className="choice-option">
                        <input
                          type="radio"
                          name={q.id}
                          checked={answers[q.id]?.selectedOptionIds.includes(opt.id) ?? false}
                          onChange={() => setSingleChoice(q.id, opt.id)}
                        />
                        {opt.text}
                      </label>
                    ))}
                  </div>
                )}

                {q.type === QuestionType.MultipleChoice && (
                  <div className="choice-list">
                    {q.options.map((opt) => (
                      <label key={opt.id} className="choice-option">
                        <input
                          type="checkbox"
                          checked={answers[q.id]?.selectedOptionIds.includes(opt.id) ?? false}
                          onChange={() => toggleMultiChoice(q.id, opt.id)}
                        />
                        {opt.text}
                      </label>
                    ))}
                  </div>
                )}

                {q.type === QuestionType.Rating && (
                  <div className="rating-buttons">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`rating-btn${answers[q.id]?.textValue === String(n) ? ' rating-btn-selected' : ''}`}
                        onClick={() => setRating(q.id, n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}

                {validationErrors[q.id] && (
                  <p className="question-error">{validationErrors[q.id]}</p>
                )}
              </div>
            ))}

            {submitError && <div className="submit-error">{submitError}</div>}

            <button
              className="survey-submit"
              disabled={submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
