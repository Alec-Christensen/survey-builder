import api from './api'
import type { SurveyResults } from '../types/results'

export async function getSurveyResults(id: string): Promise<SurveyResults> {
  const response = await api.get<SurveyResults>(`/surveys/${id}/results`)
  return response.data
}
