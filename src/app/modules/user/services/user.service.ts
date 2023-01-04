import { Injectable } from '@angular/core'
import {
  AngularFirestore,
  DocumentChangeAction
} from '@angular/fire/compat/firestore'
import { firstValueFrom, map, tap } from 'rxjs'
import { Question } from 'src/app/shared/models/Question'
import { AttemptedQuiz, Quiz } from 'src/app/shared/models/Quiz'
import { User } from 'src/app/shared/models/User'
import { StoreService } from 'src/app/shared/services/store.service'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor (
    private db: AngularFirestore,
    private storeService: StoreService
  ) {}

  getUserQuizzes (user: User) {
    const quizzes: AttemptedQuiz[] = []
    firstValueFrom(
      this.db
        .collection(`users/${user.uid}/solvedQuizzes`)
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(
              ({ payload: { doc } }: DocumentChangeAction<unknown>) => {
                quizzes.push({
                  name: doc.data()['name'],
                  thumbnail: doc.data()['thumbnail'],
                  questions: []
                })
              }
            )
          ),
          tap(() => {
            this.getLevel(user, quizzes)
          })
        )
    )
  }

  getLevel (user: User, quizzes: AttemptedQuiz[]) {
    const allQuizzes: AttemptedQuiz[] = []
    quizzes.forEach(quiz => {
      firstValueFrom(
        this.db
          .collection(`users/${user.uid}/solvedQuizzes/${quiz.name}/Level`)
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(
                ({ payload: { doc } }: DocumentChangeAction<unknown>) => {
                  allQuizzes.push({
                    name: quiz.name,
                    thumbnail: quiz.thumbnail,
                    score: doc.data()['score'],
                    level: doc.id,
                    questions: []
                  })
                }
              )
            ),
            tap(() => {
              this.storeService.updateUserQuizzes(allQuizzes)
            })
          )
      )
    })
  }

  loadAttemptedQuiz (
    language: string,
    level: string,
    user: User,
    allQuizzes: Quiz[],
    questions: Question[]
  ) {
    firstValueFrom(
      this.db
        .collection(`users/${user.uid}/solvedQuizzes`)
        .doc(language)
        .get()
        .pipe(
          map(doc => {
            if (!doc.exists) {
              this.saveQuiz(language, level, user, allQuizzes, questions)
              this.storeService.updateAttemptedQuiz({
                name: language,
                level: level,
                thumbnail: allQuizzes.find(quiz => quiz.name === language)
                  .thumbnail,
                questions: []
              })
            } else {
              firstValueFrom(
                this.db
                  .collection(`users/${user.uid}/solvedQuizzes`)
                  .doc(language)
                  .collection(`Level`)
                  .doc(level)
                  .get()
                  .pipe(
                    map(doc => {
                      if (!doc.exists) {
                        this.saveQuiz(
                          language,
                          level,
                          user,
                          allQuizzes,
                          questions
                        )
                      }
                    })
                  )
              )
              this.storeService.updateAttemptedQuiz({
                name: doc.id,
                level: level,
                thumbnail: doc.data()['thumbnail'],
                questions: this.getAttemptedQuizQuestions(language, level, user)
              })
            }
          })
        )
    )
  }

  saveQuiz (
    language: string,
    level: string,
    user: User,
    allQuizzes: Quiz[],
    questions: Question[]
  ) {
    this.db
      .collection(`users/${user.uid}/solvedQuizzes`)
      .doc(language)
      .set(
        {
          name: language,
          thumbnail: allQuizzes.find(quiz => quiz.name === language).thumbnail
        },
        { merge: true }
      )
    this.db
      .collection(`users/${user.uid}/solvedQuizzes`)
      .doc(language)
      .collection(`Level`)
      .doc(level)
      .set({ score: 0 }, { merge: true })
    questions.forEach(question => {
      this.db
        .collection(`users/${user.uid}/solvedQuizzes`)
        .doc(language)
        .collection(`Level`)
        .doc(level)
        .collection(`questions`)
        .doc(question.name)
        .set({ name: question.name, answers: [] }, { merge: true })
    })
  }

  saveQuizQuestion (
    question: Question,
    user: User,
    attemptedQuiz: AttemptedQuiz
  ) {
    const ans = question.answers
    this.db
      .collection(`users/${user.uid}/solvedQuizzes`)
      .doc(attemptedQuiz.name)
      .collection(`Level`)
      .doc(attemptedQuiz.level)
      .collection(`questions`)
      .doc(question.name)
      .set(
        {
          name: question.name,
          answers: ans
        },
        { merge: true }
      )
  }

  calculate (attemptedQuiz: AttemptedQuiz) {
    var sum = 0
    attemptedQuiz.questions.forEach(question => {
      if (question.answers.length !== 0 && question.answers[0].correct) sum++
    })
    this.storeService.updateScoreInAttemptedQuiz(sum)
    // return sum
    // return (sum / this.state.attemptedQuiz.questions.length) * 100
  }

  getAttemptedQuizQuestions (language: string, level: string, user: User) {
    const questions: Question[] = []
    firstValueFrom(
      this.db
        .collection(`users/${user.uid}/solvedQuizzes`)
        .doc(language)
        .collection(`Level`)
        .doc(level)
        .collection(`questions`)
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(
              ({ payload: { doc } }: DocumentChangeAction<unknown>) => {
                questions.push({
                  id: doc.id,
                  name: doc.data()['name'],
                  answers: doc.data()['answers']
                })
              }
            )
          )
        )
    )
    return questions
  }
}
