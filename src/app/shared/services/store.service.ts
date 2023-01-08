import { Injectable } from '@angular/core'
import { Store } from '../classes/store.class'
import { Question } from '../models/Question'
import { AttemptedQuiz, Quiz } from '../models/Quiz'
import { User } from '../models/User'
import firebase from 'firebase/compat/app'

interface StoreInterface {
  user?: User
  attemptedQuiz: AttemptedQuiz
  errorMessage?: string
  allQuizzes: Quiz[]
  levels: string[]
  questions: Question[]
}

const initialState: StoreInterface = {
  user: undefined,
  attemptedQuiz: undefined,
  errorMessage: undefined,
  allQuizzes: [],
  levels: [],
  questions: []
}

@Injectable({
  providedIn: 'root'
})
export class StoreService extends Store<StoreInterface> {
  constructor () {
    super(initialState)
  }

  user$ = this.select(({ user }) => user)
  attemptedQuiz$ = this.select(({ attemptedQuiz }) => attemptedQuiz)
  errorMessage$ = this.select(({ errorMessage }) => errorMessage)
  allQuizzes$ = this.select(({ allQuizzes }) => allQuizzes)
  levels$ = this.select(({ levels }) => levels)
  questions$ = this.select(({ questions }) => questions)

  updateLevelsState (levels: string[]) {
    this.setState({ levels })
  }
  updateQuestionsState (questions: Question[]) {
    this.setState({ questions })
  }

  updateAllQuizzes (allQuizzes: Quiz[]) {
    this.setState({ allQuizzes })
  }

  updateUserState (user: firebase.User) {
    if (!user) {
      this.setState({ user: undefined })
    } else {
      this.setState({
        user: { uid: user.uid, email: user.email, solvedQuizzes: [] }
      })
    }
  }

  updateErrorMessageState (errorMessage: string) {
    this.setState({ errorMessage })
  }

  updateUserQuizzes (quizzes: AttemptedQuiz[]) {
    const { solvedQuizzes, ...rest } = this.state.user
    this.setState({ user: { solvedQuizzes: quizzes, ...rest } })
  }

  updateCompletionInAttemptedQuiz (complete: boolean) {
    const { isCompleted, ...rest } = this.state.attemptedQuiz
    this.setState({ attemptedQuiz: { isCompleted: complete, ...rest } })
  }

  updateAttemptedQuiz (attemptedQuiz: AttemptedQuiz) {
    this.setState({
      attemptedQuiz: {
        name: attemptedQuiz.name,
        level: attemptedQuiz.level,
        thumbnail: attemptedQuiz.thumbnail,
        isCompleted: attemptedQuiz.isCompleted,
        score: 0,
        questions: attemptedQuiz.questions
      }
    })
  }

  updateScoreInAttemptedQuiz (_score: number) {
    const { score, ...rest } = this.state.attemptedQuiz
    this.setState({ attemptedQuiz: { score: _score, ...rest } })
  }

  updateTotalQuestionsInAttemptedQuiz (total: number) {
    const { totalQuestions, ...rest } = this.state.attemptedQuiz
    this.setState({ attemptedQuiz: { totalQuestions: total, ...rest } })
  }

  updateLevelInAttemptedQuiz (_level: string) {
    const { level, ...rest } = this.state.attemptedQuiz
    this.setState({ attemptedQuiz: { level: _level, ...rest } })
  }
}
