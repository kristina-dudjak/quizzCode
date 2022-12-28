import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { firstValueFrom, map } from 'rxjs'
import { Store } from 'src/app/shared/classes/store.class'
import { Quiz } from 'src/app/shared/models/Quiz'

interface QuizInterface {
  allQuizzes: Quiz[]
}

const initialState: QuizInterface = {
  allQuizzes: []
}

@Injectable({
  providedIn: 'root'
})
export class QuizService extends Store<QuizInterface> {
  constructor (private db: AngularFirestore) {
    super(initialState)
  }

  allQuizzes$ = this.select(({ allQuizzes }) => allQuizzes)

  updateQuizzesState (allQuizzes: Quiz[]) {
    this.setState({ allQuizzes })
  }

  addQuizToQuizzes (quiz: Quiz) {
    this.setState({ allQuizzes: this.state.allQuizzes.concat(quiz) })
  }

  getAllQuizzes () {
    return firstValueFrom(
      this.db
        .collection('quizzes')
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(a => {
              const image = a.payload.doc.data()['thumbnail']
              const language = a.payload.doc.id
              const quiz: Quiz = {
                name: language,
                thumbnail: image,
                levels: []
              }
              this.addQuizToQuizzes(quiz)
            })
          )
        )
    )
  }

  getQuizLevel (language: string) {
    firstValueFrom(
      this.db
        .collection(`quizzes/${language}/Level`)
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(a => {
              const level = a.payload.doc.id
              console.log(level)
              this.getMultipleChoiceQuestions(language, level)
            })
          )
        )
    )
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
