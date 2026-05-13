import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSurveyResults } from '../services/resultsService'
import type { SurveyResults, QuestionResult } from '../types/results'
import { QuestionType } from '../types/question'
import './results.css'

function questionTypeLabel(type: QuestionType): string {
  switch (type) {
    case QuestionType.Text: return 'Text'
    case QuestionType.SingleChoice: return 'Single Choice'
    case QuestionType.MultipleChoice: return 'Multiple Choice'
    case QuestionType.Rating: return 'Rating'
  }
}

function TextAnswers({ answers }: { answers: string[] }) {
  if (answers.length === 0) {
    return <p className="results-empty">No answers yet.</p>
  }
  return (
    <ul className="text-answers">
      {answers.map((a, i) => (
        <li key={i} className="text-answer">{a}</li>
      ))}
    </ul>
  )
}

function OptionChart({ question }: { question: QuestionResult }) {
  if (question.optionResults.length === 0) {
    return <p className="results-empty">No answers yet.</p>
  }
  return (
    <ul className="option-chart">
      {question.optionResults.map((opt) => (
        <li key={opt.optionId} className="option-row">
          <span className="option-label">{opt.text}</span>
          <div className="bar-track">
            <div
              className="bar-fill"
              style={{ width: `${opt.percentage}%` }}
            />
          </div>
          <span className="option-stats">{opt.count} ({opt.percentage}%)</span>
        </li>
      ))}
    </ul>
  )
}

function QuestionCard({ question }: { question: QuestionResult }) {
  const isChoice =
    question.type === QuestionType.SingleChoice ||
    question.type === QuestionType.MultipleChoice

  return (
    <div className="question-card">
      <div className="question-card-header">
        <p className="question-text">{question.text}</p>
        <span className="type-badge">{questionTypeLabel(question.type)}</span>
      </div>
      <p className="answer-count">{question.answerCount} answer{question.answerCount !== 1 ? 's' : ''}</p>
      {isChoice
        ? <OptionChart question={question} />
        : <TextAnswers answers={question.textAnswers} />}
    </div>
  )
}

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [results, setResults] = useState<SurveyResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getSurveyResults(id!)
        setResults(data)
      } catch {
        setError('Failed to load results. The survey may not exist or you may not have access.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="results-page">
        <div className="results-container">
          <p className="results-loading">Loading results…</p>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="results-page">
        <div className="results-container">
          <p className="results-error">{error ?? 'Survey not found.'}</p>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="results-page">
      <div className="results-container">
        <button className="btn btn-secondary back-btn" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>

        <div className="results-header">
          <h1 className="results-title">{results.title}</h1>
          <div className="response-count-badge">
            {results.responseCount} response{results.responseCount !== 1 ? 's' : ''}
          </div>
        </div>

        {results.questions.length === 0 ? (
          <p className="results-empty">This survey has no questions.</p>
        ) : (
          <div className="questions-list">
            {results.questions.map((q) => (
              <QuestionCard key={q.questionId} question={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
