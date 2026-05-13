import type { QuestionType } from './question'

export interface OptionResult {
  optionId: string
  text: string
  count: number
  percentage: number
}

export interface QuestionResult {
  questionId: string
  text: string
  type: QuestionType
  order: number
  answerCount: number
  textAnswers: string[]
  optionResults: OptionResult[]
}

export interface SurveyResults {
  surveyId: string
  title: string
  responseCount: number
  questions: QuestionResult[]
}
