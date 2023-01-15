import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Question } from 'src/app/shared/models/Question'
import { Quiz } from 'src/app/shared/models/Quiz'

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor (private db: AngularFirestore) {}

  async saveNewQuizToDb (
    newQuiz: Quiz,
    attemptedQuiz: Quiz,
    questions: Question[]
  ) {
    if (attemptedQuiz) await this.deleteAttemptedQuiz(attemptedQuiz, questions)
    this.db
      .collection('quizzes')
      .doc(newQuiz.name)
      .set({ thumbnail: newQuiz.thumbnail }, { merge: true })
    this.db
      .collection(`quizzes/${newQuiz.name}/Level`)
      .doc(newQuiz.level)
      .set({ level: newQuiz.level }, { merge: true })
    newQuiz.questions.forEach(question => {
      this.db
        .collection(
          `quizzes/${newQuiz.name}/Level/${newQuiz.level}/multipleChoiceQuestions`
        )
        .doc(question.id.toString())
        .set({ name: question.name, id: question.id }, { merge: true })
      question.answers.forEach(answer => {
        this.db
          .collection(
            `quizzes/${newQuiz.name}/Level/${newQuiz.level}/multipleChoiceQuestions/${question.id}/answers`
          )
          .doc(answer.id)
          .set({ name: answer.name, correct: answer.correct }, { merge: true })
      })
    })
  }

  async deleteAttemptedQuiz (quiz: Quiz, questions: Question[]) {
    questions.forEach(async question => {
      const qry: firebase.default.firestore.QuerySnapshot = await this.db
        .collection(
          `quizzes/${quiz.name}/Level/${quiz.level}/multipleChoiceQuestions/${question.id}/answers`
        )
        .ref.get()
      qry.forEach(doc => {
        doc.ref.delete()
      })
    })
    const quest: firebase.default.firestore.QuerySnapshot = await this.db
      .collection(
        `quizzes/${quiz.name}/Level/${quiz.level}/multipleChoiceQuestions`
      )
      .ref.get()
    quest.forEach(doc => {
      doc.ref.delete()
    })
    this.db.doc(`quizzes/${quiz.name}/Level/${quiz.level}`).delete()
    const level: firebase.default.firestore.QuerySnapshot = await this.db
      .collection(`quizzes/${quiz.name}/Level`)
      .ref.get()
    if (level.empty) {
      this.db.doc(`quizzes/${quiz.name}`).delete()
    }
  }
}
