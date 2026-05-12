export interface Survey {
  id: string
  title: string
  description: string | null
  isPublished: boolean
  shareableCode: string
  createdAt: string
}

export interface UpdateSurveyRequest {
  title: string
  description: string | null
  isPublished: boolean
}
