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

  getUserQuizLanguages (user: User) {
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
                  isCompleted: false,
                  questions: []
                })
              }
            )
          ),
          tap(async () => {
            await this.getAllUserQuizzes(user, quizzes)
          })
        )
    )
  }

  async getAllUserQuizzes (user: User, quizzes: AttemptedQuiz[]) {
    const allQuizzes: AttemptedQuiz[] = []
    for (const quiz of quizzes) {
      await firstValueFrom(
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
                    isCompleted: doc.data()['isCompleted'],
                    maxScore: doc.data()['maxScore'],
                    level: doc.id,
                    questions: []
                  })
                }
              )
            )
          )
      )
    }
    this.storeService.updateUserQuizzes(allQuizzes)
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
          map(async doc => {
            if (!doc.exists) {
              await this.saveQuiz(language, level, user, allQuizzes, questions)
            } else {
              firstValueFrom(
                this.db
                  .collection(
                    `users/${user.uid}/solvedQuizzes/${language}/Level`
                  )
                  .doc(level)
                  .get()
                  .pipe(
                    map(async doc => {
                      if (!doc.exists || doc.data()['isCompleted']) {
                        await this.saveQuiz(
                          language,
                          level,
                          user,
                          allQuizzes,
                          questions
                        )
                      } else {
                        this.storeService.updateAttemptedQuiz({
                          name: language,
                          level: level,
                          isCompleted: doc.data()['isCompleted'],
                          score: doc.data()['score'],
                          maxScore: doc.data()['maxScore'],
                          thumbnail: allQuizzes.find(
                            quiz => quiz.name === language
                          ).thumbnail,
                          questions: await this.getAttemptedQuizQuestions(
                            language,
                            level,
                            user
                          )
                        })
                      }
                    })
                  )
              )
            }
          })
        )
    )
  }

  async saveQuiz (
    language: string,
    level: string,
    user: User,
    allQuizzes: Quiz[],
    questions: Question[]
  ) {
    var sum = 0
    questions.forEach(question => {
      question.answers.forEach(answer => {
        if (answer.correct) sum++
      })
    })
    const thumbnail = allQuizzes.find(quiz => quiz.name === language).thumbnail
    const batch = this.db.firestore.batch()
    const quizRef = this.db
      .collection(`users/${user.uid}/solvedQuizzes`)
      .doc(language).ref
    batch.set(
      quizRef,
      { name: language, thumbnail: thumbnail },
      { merge: true }
    )
    const levelRef = quizRef.collection('Level').doc(level)
    batch.set(
      levelRef,
      { score: 0, maxScore: sum, isCompleted: false },
      { merge: true }
    )
    for (const question of questions) {
      const questionRef = levelRef.collection('questions').doc(question.name)
      batch.set(
        questionRef,
        { name: question.name, answers: [] },
        { merge: true }
      )
    }
    await batch.commit()
    this.storeService.updateAttemptedQuiz({
      name: language,
      level: level,
      isCompleted: false,
      thumbnail: thumbnail,
      maxScore: sum,
      questions: await this.getAttemptedQuizQuestions(language, level, user)
    })
  }

  async saveQuizQuestion (
    question: Question,
    user: User,
    attemptedQuiz: AttemptedQuiz
  ) {
    await this.db
      .collection(
        `users/${user.uid}/solvedQuizzes/${attemptedQuiz.name}/Level/${attemptedQuiz.level}/questions`
      )
      .doc(question.name)
      .set(
        {
          answers: attemptedQuiz.questions
            .find(q => q.name === question.name)
            .answers.concat(question.answers)
        },
        { merge: true }
      )
      .then(async () => {
        this.storeService.updateQuestionsInAttemptedQuiz(
          await this.getAttemptedQuizQuestions(
            attemptedQuiz.name,
            attemptedQuiz.level,
            user
          )
        )
      })
  }

  async removeQuizQuestion (
    question: Question,
    user: User,
    attemptedQuiz: AttemptedQuiz
  ) {
    await this.db
      .collection(
        `users/${user.uid}/solvedQuizzes/${attemptedQuiz.name}/Level/${attemptedQuiz.level}/questions`
      )
      .doc(question.name)
      .set(
        {
          answers: attemptedQuiz.questions
            .find(qu => qu.name === question.name)
            .answers.filter(answer => answer.name !== question.answers[0].name)
        },
        { merge: true }
      )
      .then(async () => {
        this.storeService.updateQuestionsInAttemptedQuiz(
          await this.getAttemptedQuizQuestions(
            attemptedQuiz.name,
            attemptedQuiz.level,
            user
          )
        )
      })
  }

  async saveQuizScore (attemptedQuiz: AttemptedQuiz, user: User) {
    var sum = 0
    attemptedQuiz.questions.forEach(question => {
      if (question.answers.length !== 0) {
        question.answers.forEach(answer => {
          if (answer.correct) sum++
          else sum--
        })
      }
    })
    await this.db
      .collection(`users/${user.uid}/solvedQuizzes/${attemptedQuiz.name}/Level`)
      .doc(attemptedQuiz.level)
      .set({ score: sum, isCompleted: true }, { merge: true })
    this.storeService.updateScoreInAttemptedQuiz(sum)
    this.storeService.updateCompletionInAttemptedQuiz(true)
  }

  async getAttemptedQuizQuestions (language: string, level: string, user: User) {
    const questions: Question[] = []
    await firstValueFrom(
      this.db
        .collection(
          `users/${user.uid}/solvedQuizzes/${language}/Level/${level}/questions`
        )
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(
              ({ payload: { doc } }: DocumentChangeAction<unknown>) => {
                questions.push({
                  id: doc.data()['id'],
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
