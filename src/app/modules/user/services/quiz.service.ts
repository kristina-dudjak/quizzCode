import { Injectable } from '@angular/core'
import {
  AngularFirestore,
  DocumentChangeAction
} from '@angular/fire/compat/firestore'
import { firstValueFrom, map, tap } from 'rxjs'
import { Store } from 'src/app/shared/classes/store.class'
import { AttemptedQuiz, Quiz } from 'src/app/shared/models/Quiz'

interface QuizInterface {
  allQuizzes: Quiz[]
  attemptedQuiz: AttemptedQuiz
  levels: string[]
}

const initialState: QuizInterface = {
  allQuizzes: [],
  attemptedQuiz: undefined,
  levels: []
}

@Injectable({
  providedIn: 'root'
})
export class QuizService extends Store<QuizInterface> {
  constructor (private db: AngularFirestore) {
    super(initialState)
  }

  allQuizzes$ = this.select(({ allQuizzes }) => allQuizzes)
  attemptedQuiz$ = this.select(({ attemptedQuiz }) => attemptedQuiz)
  levels$ = this.select(({ levels }) => levels)

  updateLevelsState (levels: string[]) {
    this.setState({ levels })
  }

  addQuizToQuizzes (quiz: Quiz) {
    this.setState({ allQuizzes: this.state.allQuizzes.concat(quiz) })
  }

  initialQuizzesLoad () {
    firstValueFrom(
      this.db
        .collection('quizzes')
        .snapshotChanges()
        .pipe(
          tap(actions =>
            actions.map(({ payload: { doc } }: DocumentChangeAction<Quiz>) => {
              this.addQuizToQuizzes({
                name: doc.id,
                thumbnail: doc.data()['thumbnail']
              })
            })
          )
        )
    )
  }

  updateAttemptedQuiz (attemptedQuiz: Quiz) {
    this.setState({ attemptedQuiz })
  }

  updateLevelInAttemptedQuiz (_level: string) {
    const { level, ...rest } = this.state.attemptedQuiz
    this.setState({ attemptedQuiz: { level: _level, ...rest } })
  }

  loadQuizLevels (language: string) {
    const levels = []
    firstValueFrom(
      this.db
        .collection(`quizzes/${language}/Level`)
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(
              ({
                payload: {
                  doc: { id }
                }
              }: DocumentChangeAction<unknown>) => {
                levels.push(id)
              }
            )
          )
        )
    )
    this.updateLevelsState(levels)
  }

  getMultipleChoiceQuestions (language: string, level: string) {
    firstValueFrom(
      this.db
        .collection(
          `quizzes/${language}/Level/${level}/multipleChoiceQuestions`
        )
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(a => {
              const question = a.payload.doc.data()
              const questionId = a.payload.doc.id
              console.log(question)
              console.log(questionId)
              this.getAnswers(language, level, questionId)
            })
          )
        )
    )
  }

  getAnswers (language: string, level: string, questionId: string) {
    firstValueFrom(
      this.db
        .collection(
          `quizzes/${language}/Level/${level}/multipleChoiceQuestions/${questionId}/answers`
        )
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(a => {
              const answer = a.payload.doc.data()
              const answerId = a.payload.doc.id
              console.log(answer)
              console.log(answerId)
            })
          )
        )
    )
  }
}
