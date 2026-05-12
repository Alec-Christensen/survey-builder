import api from './api'
import type { Question, CreateQuestionRequest, UpdateQuestionRequest } from '../types/question'

export async function getQuestions(surveyId: string): Promise<Question[]> {
  const response = await api.get<Question[]>(`/surveys/${surveyId}/questions`)
  return response.data
}

export async function createQuestion(surveyId: string, data: CreateQuestionRequest): Promise<Question> {
  const response = await api.post<Question>(`/surveys/${surveyId}/questions`, data)
  return response.data
}

export async function updateQuestion(
  surveyId: string,
  questionId: string,
  data: UpdateQuestionRequest,
): Promise<Question> {
  const response = await api.put<Question>(`/surveys/${surveyId}/questions/${questionId}`, data)
  return response.data
}

export async function deleteQuestion(surveyId: string, questionId: string): Promise<void> {
  await api.delete(`/surveys/${surveyId}/questions/${questionId}`)
}
