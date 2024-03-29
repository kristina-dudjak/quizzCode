import { Question } from './Question'

export interface Quiz {
  name: string
  thumbnail: string
  level?: string
  questions?: Question[]
}

export interface AttemptedQuiz extends Quiz {
  score?: number
  maxScore?: number
  isCompleted: boolean
}
