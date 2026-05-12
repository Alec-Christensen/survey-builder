export enum QuestionType {
  Text = 0,
  SingleChoice = 1,
  MultipleChoice = 2,
  Rating = 3,
}

export interface Question {
  id: string
  surveyId: string
  text: string
  type: QuestionType
  order: number
  isRequired: boolean
}

export interface Option {
  id: string
  questionId: string
  text: string
  order: number
}

export interface CreateQuestionRequest {
  text: string
  type: QuestionType
  order: number
  isRequired: boolean
}

export interface UpdateQuestionRequest {
  text: string
  type: QuestionType
  order: number
  isRequired: boolean
}

export interface CreateOptionRequest {
  text: string
  order: number
}

export interface UpdateOptionRequest {
  text: string
  order: number
}
