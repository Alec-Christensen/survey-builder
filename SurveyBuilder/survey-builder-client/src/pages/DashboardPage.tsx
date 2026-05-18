import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken } from '../services/authService'
import { getSurveys, updateSurvey, deleteSurvey } from '../services/surveyService'
import type { Survey } from '../types/survey'
import Navbar from '../components/Navbar'
import './dashboard.css'

type FilterTab = 'all' | 'published' | 'unpublished'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

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

  async function handleCopy(surveyId: string, url: string) {
    await navigator.clipboard.writeText(url)
    setCopiedId(surveyId)
    setTimeout(() => setCopiedId(null), 2000)
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

  const filteredSurveys = surveys.filter((s) => {
    if (activeTab === 'published') return s.isPublished
    if (activeTab === 'unpublished') return !s.isPublished
    return true
  })

  const emptyMessages: Record<FilterTab, string> = {
    all: "No surveys yet. Click 'Create Survey' to get started.",
    published: 'No published surveys.',
    unpublished: 'No unpublished surveys.',
  }

  return (
    <>
      <Navbar
        primaryAction={{ label: 'Create Survey', onClick: () => navigate('/surveys/create') }}
        secondaryAction={{ label: 'Log out', onClick: handleLogout }}
      />
      <div className="page-container">
        {error && <div className="dashboard-error">{error}</div>}

        <div className="filter-tabs">
          {(['all', 'published', 'unpublished'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              className={`filter-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="dashboard-status">Loading surveys…</div>
        ) : filteredSurveys.length === 0 ? (
          <div className="empty-state">{emptyMessages[activeTab]}</div>
        ) : (
          <div className="survey-list">
            {filteredSurveys.map((survey) => {
              const url = `${window.location.origin}/survey/${survey.shareableCode}`
              return (
                <div key={survey.id} className="card">
                  <div className="survey-card-top">
                    <h2 className="survey-card-title">{survey.title}</h2>
                    <span className={`status-badge ${survey.isPublished ? 'published' : 'unpublished'}`}>
                      {survey.isPublished ? 'Published' : 'Unpublished'}
                    </span>
                  </div>

                  <div className="survey-link-row">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="survey-link-text"
                    >
                      {url}
                    </a>
                    <button
                      className={`btn btn-secondary btn-sm copy-btn${copiedId === survey.id ? ' copied' : ''}`}
                      onClick={() => handleCopy(survey.id, url)}
                    >
                      {copiedId === survey.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="card-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/surveys/${survey.id}/results`)}
                    >
                      Results
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/surveys/${survey.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className={`btn btn-sm ${survey.isPublished ? 'btn-secondary' : 'btn-primary'}`}
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
                      className="btn btn-danger btn-sm"
                      disabled={deletingId === survey.id}
                      onClick={() => handleDelete(survey.id)}
                    >
                      {deletingId === survey.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
