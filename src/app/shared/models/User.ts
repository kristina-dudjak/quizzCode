import { AttemptedQuiz } from './Quiz'

export interface User {
  uid: string
  email: string
  solvedQuizzes: AttemptedQuiz[]
}
