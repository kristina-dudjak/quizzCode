import { Question } from './Question'

export interface Level {
  name: string
  multipleChoiceQuestions: Question[]
}
