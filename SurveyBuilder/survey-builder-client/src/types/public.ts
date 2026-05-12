import type { QuestionType } from './question'

export interface PublicOption {
  id: string
  questionId: string
  text: string
  order: number
}

export interface PublicQuestion {
  id: string
  text: string
  type: QuestionType
  order: number
  isRequired: boolean
  options: PublicOption[]
}

export interface PublicSurvey {
  id: string
  title: string
  description: string | null
  shareableCode: string
  questions: PublicQuestion[]
}

export interface SubmitAnswerRequest {
  questionId: string
  textValue: string | null
  selectedOptionIds: string[]
}

export interface SubmitResponseRequest {
  answers: SubmitAnswerRequest[]
}

export interface SubmitResponseResponse {
  responseId: string
  submittedAt: string
}
