import { Answer } from './Answer'

export interface Question {
  id: string
  name: string
  answers: Answer[]
}
