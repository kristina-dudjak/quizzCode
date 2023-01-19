import { Injectable } from '@angular/core'
import {
  AngularFirestore,
  DocumentChangeAction
} from '@angular/fire/compat/firestore'
import { firstValueFrom, map, tap } from 'rxjs'
import { Answer } from 'src/app/shared/models/Answer'
import { Question } from 'src/app/shared/models/Question'
import { Quiz } from 'src/app/shared/models/Quiz'
import { StoreService } from 'src/app/shared/services/store.service'

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  constructor (
    private db: AngularFirestore,
    private storeService: StoreService
  ) {}

  initialQuizzesLoad () {
    const quizzes: Quiz[] = []
    firstValueFrom(
      this.db
        .collection('quizzes')
        .snapshotChanges()
        .pipe(
          tap(actions =>
            actions.map(({ payload: { doc } }: DocumentChangeAction<Quiz>) => {
              quizzes.push({
                name: doc.id,
                thumbnail: doc.data()['thumbnail']
              })
            })
          )
        )
    ).then(() => {
      this.storeService.updateAllQuizzes(quizzes)
    })
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
    ).then(() => {
      this.storeService.updateLevelsState(levels)
    })
  }
  initialQuestionsLoad (language: string, level: string) {
    const questions: Question[] = []
    firstValueFrom(
      this.db
        .collection(
          `quizzes/${language}/Level/${level}/multipleChoiceQuestions`,
          ref => ref.orderBy('id')
        )
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(
              async ({ payload: { doc } }: DocumentChangeAction<unknown>) => {
                questions.push({
                  id: doc.data()['id'],
                  name: doc.data()['name'],
                  answers: await this.getAnswers(language, level, doc.id)
                })
              }
            )
          )
        )
    ).then(() => {
      this.storeService.updateQuestionsState(questions)
    })
  }

  async getAnswers (language: string, level: string, questionId: string) {
    const answers: Answer[] = []
    await firstValueFrom(
      this.db
        .collection(
          `quizzes/${language}/Level/${level}/multipleChoiceQuestions/${questionId}/answers`
        )
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(
              ({ payload: { doc } }: DocumentChangeAction<unknown>) => {
                answers.push({
                  id: doc.id,
                  name: doc.data()['name'],
                  correct: doc.data()['correct']
                })
              }
            )
          )
        )
    )
    return answers
  }
}
