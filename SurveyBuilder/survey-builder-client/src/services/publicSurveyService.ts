import api from './api'
import { isAxiosError } from 'axios'
import type { PublicSurvey, SubmitResponseRequest, SubmitResponseResponse } from '../types/public'

export async function getPublicSurvey(shareableCode: string): Promise<PublicSurvey> {
  const response = await api.get<PublicSurvey>(`/public/surveys/${shareableCode}`)
  return response.data
}

export async function submitResponse(
  shareableCode: string,
  data: SubmitResponseRequest,
): Promise<SubmitResponseResponse> {
  try {
    const response = await api.post<SubmitResponseResponse>(
      `/public/surveys/${shareableCode}/responses`,
      data,
    )
    return response.data
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 400) {
      const message = err.response.data?.message ?? 'Submission failed.'
      throw new Error(message)
    }
    throw err
  }
}
