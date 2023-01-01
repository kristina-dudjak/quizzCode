import { Question } from './Question'

export interface Quiz {
  name: string
  thumbnail: string
}

export interface AttemptedQuiz extends Quiz {
  level?: string
  questions: Question[]
}
