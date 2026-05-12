import api from './api'
import type { Survey, UpdateSurveyRequest } from '../types/survey'

export async function getSurveys(): Promise<Survey[]> {
  const response = await api.get<Survey[]>('/surveys')
  return response.data
}

export async function updateSurvey(id: string, data: UpdateSurveyRequest): Promise<Survey> {
  const response = await api.put<Survey>(`/surveys/${id}`, data)
  return response.data
}

export async function deleteSurvey(id: string): Promise<void> {
  await api.delete(`/surveys/${id}`)
}
