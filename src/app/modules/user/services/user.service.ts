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
                    totalQuestions: doc.data()['totalQuestions'],
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

  async loadAttemptedQuiz (
    language: string,
    level: string,
    user: User,
    allQuizzes: Quiz[],
    questions: Question[]
  ) {
    let quizRef = this.db
      .collection(`users/${user.uid}/solvedQuizzes`)
      .doc(language).ref
    let quizDoc = await quizRef.get()
    if (!quizDoc.exists) {
      await this.saveQuiz(language, level, user, allQuizzes, questions)
    } else {
      let levelRef = quizRef.collection('Level').doc(level)
      let levelDoc = await levelRef.get()
      if (!levelDoc.exists || levelDoc.data()['isCompleted']) {
        await this.saveQuiz(language, level, user, allQuizzes, questions)
      }
      let quizThumbnail = allQuizzes.find(
        quiz => quiz.name === language
      ).thumbnail
      this.storeService.updateAttemptedQuiz({
        name: quizDoc.id,
        level: level,
        isCompleted: levelDoc.data()['isCompleted'],
        thumbnail: quizThumbnail,
        questions: await this.getAttemptedQuizQuestions(language, level, user)
      })
    }
  }

  async saveQuiz (
    language: string,
    level: string,
    user: User,
    allQuizzes: Quiz[],
    questions: Question[]
  ) {
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
      { score: 0, totalQuestions: questions.length, isCompleted: false },
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
    const attemptedQuizQuestions = this.getAttemptedQuizQuestions(
      language,
      level,
      user
    )
    this.storeService.updateAttemptedQuiz({
      name: language,
      level: level,
      isCompleted: false,
      thumbnail: thumbnail,
      questions: await attemptedQuizQuestions
    })
  }

  saveQuizQuestion (
    question: Question,
    user: User,
    attemptedQuiz: AttemptedQuiz
  ) {
    this.db
      .collection(
        `users/${user.uid}/solvedQuizzes/${attemptedQuiz.name}/Level/${attemptedQuiz.level}/questions`
      )
      .doc(question.name)
      .set(
        {
          name: question.name,
          answers: question.answers
        },
        { merge: true }
      )
      .then(async () => {
        this.storeService.updateAttemptedQuiz({
          name: attemptedQuiz.name,
          level: attemptedQuiz.level,
          thumbnail: attemptedQuiz.thumbnail,
          isCompleted: false,
          questions: await this.getAttemptedQuizQuestions(
            attemptedQuiz.name,
            attemptedQuiz.level,
            user
          )
        })
      })
  }

  saveQuizScore (attemptedQuiz: AttemptedQuiz, user: User) {
    var sum = 0
    attemptedQuiz.questions.forEach(question => {
      if (question.answers.length !== 0 && question.answers[0].correct) sum++
    })
    this.db
      .collection(`users/${user.uid}/solvedQuizzes/${attemptedQuiz.name}/Level`)
      .doc(attemptedQuiz.level)
      .set({ score: sum, isCompleted: true }, { merge: true })
    this.storeService.updateScoreInAttemptedQuiz(sum)
    this.storeService.updateTotalQuestionsInAttemptedQuiz(
      attemptedQuiz.questions.length
    )
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
