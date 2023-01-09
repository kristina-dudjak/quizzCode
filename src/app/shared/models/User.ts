import { AttemptedQuiz } from './Quiz'

export interface User {
  uid: string
  email: string
  isAdmin: boolean
  solvedQuizzes: AttemptedQuiz[]
}
