import { Question } from './Question'

export interface Quiz {
  name: string
  thumbnail: string
}

export interface AttemptedQuiz extends Quiz {
  level?: string
  score?: number
  totalQuestions?: number
  isCompleted: boolean
  questions: Question[]
}
