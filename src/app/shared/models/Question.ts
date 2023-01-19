import { Answer } from './Answer'

export interface Question {
  id: number
  name: string
  answers: Answer[]
}
