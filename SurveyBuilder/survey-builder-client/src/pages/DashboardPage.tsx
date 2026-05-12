import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService'
import { getSurveys, updateSurvey, deleteSurvey } from '../services/surveyService'
import type { Survey } from '../types/survey'
import './dashboard.css'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    getSurveys()
      .then(setSurveys)
      .catch(() => setError('Failed to load surveys. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  function handleLogout() {
    clearToken()
    navigate('/')
  }

  async function handleTogglePublish(survey: Survey) {
    setTogglingId(survey.id)
    try {
      const updated = await updateSurvey(survey.id, {
        title: survey.title,
        description: survey.description,
        isPublished: !survey.isPublished,
      })
      setSurveys((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    } catch {
      setError('Failed to update survey. Please try again.')
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteSurvey(id)
      setSurveys((prev) => prev.filter((s) => s.id !== id))
    } catch {
      setError('Failed to delete survey. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>My Surveys</h1>
        <div className="dashboard-header-actions">
          <button className="btn btn-primary" onClick={() => navigate('/surveys/create')}>
            Create Survey
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      {loading ? (
        <div className="dashboard-status">Loading surveys…</div>
      ) : surveys.length === 0 ? (
        <div className="dashboard-empty">
          <p>You haven't created any surveys yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/surveys/create')}>
            Create your first survey
          </button>
        </div>
      ) : (
        <div className="survey-list">
          {surveys.map((survey) => (
            <div key={survey.id} className="survey-card">
              <div className="survey-card-top">
                <h2 className="survey-card-title">{survey.title}</h2>
                <span className={`badge ${survey.isPublished ? 'badge-published' : 'badge-unpublished'}`}>
                  {survey.isPublished ? 'Published' : 'Unpublished'}
                </span>
              </div>

              {survey.description && (
                <p className="survey-card-description">{survey.description}</p>
              )}

              <p className="survey-card-code">Code: {survey.shareableCode}</p>

              <div className="survey-card-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/surveys/${survey.id}/results`)}
                >
                  Results
                </button>
                <button
                  className="btn btn-secondary"
                  disabled={togglingId === survey.id}
                  onClick={() => handleTogglePublish(survey)}
                >
                  {togglingId === survey.id
                    ? 'Saving…'
                    : survey.isPublished
                    ? 'Unpublish'
                    : 'Publish'}
                </button>
                <button
                  className="btn btn-danger"
                  disabled={deletingId === survey.id}
                  onClick={() => handleDelete(survey.id)}
                >
                  {deletingId === survey.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
