import api from './api'
import type { Option, CreateOptionRequest, UpdateOptionRequest } from '../types/question'

export async function getOptions(surveyId: string, questionId: string): Promise<Option[]> {
  const response = await api.get<Option[]>(`/surveys/${surveyId}/questions/${questionId}/options`)
  return response.data
}

export async function createOption(
  surveyId: string,
  questionId: string,
  data: CreateOptionRequest,
): Promise<Option> {
  const response = await api.post<Option>(
    `/surveys/${surveyId}/questions/${questionId}/options`,
    data,
  )
  return response.data
}

export async function updateOption(
  surveyId: string,
  questionId: string,
  optionId: string,
  data: UpdateOptionRequest,
): Promise<Option> {
  const response = await api.put<Option>(
    `/surveys/${surveyId}/questions/${questionId}/options/${optionId}`,
    data,
  )
  return response.data
}

export async function deleteOption(
  surveyId: string,
  questionId: string,
  optionId: string,
): Promise<void> {
  await api.delete(`/surveys/${surveyId}/questions/${questionId}/options/${optionId}`)
}
