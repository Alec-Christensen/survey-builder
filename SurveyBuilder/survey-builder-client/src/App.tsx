import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import SurveyEditorPage from './pages/SurveyEditorPage'
import PublicSurveyPage from './pages/PublicSurveyPage'
import ResultsPage from './pages/ResultsPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/survey/:shareableCode" element={<PublicSurveyPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/surveys/create" element={<SurveyEditorPage />} />
        <Route path="/surveys/:id/edit" element={<SurveyEditorPage />} />
        <Route path="/surveys/:id/results" element={<ResultsPage />} />
      </Route>
    </Routes>
  )
}

export default App
