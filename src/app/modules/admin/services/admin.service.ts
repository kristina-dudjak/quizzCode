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
    if (attemptedQuiz && attemptedQuiz.name !== '')
      await this.deleteAttemptedQuiz(attemptedQuiz, questions)
    const quizzesRef = this.db.collection('quizzes').doc(newQuiz.name)
    const levelRef = quizzesRef.collection('Level').doc(newQuiz.level)
    const batch = this.db.firestore.batch()
    batch
      .set(quizzesRef.ref, { thumbnail: newQuiz.thumbnail })
      .set(levelRef.ref, { level: newQuiz.level })
    newQuiz.questions.forEach(question => {
      const questionRef = this.db
        .collection(
          `quizzes/${newQuiz.name}/Level/${newQuiz.level}/multipleChoiceQuestions`
        )
        .doc(question.id.toString())
      batch.set(questionRef.ref, { name: question.name, id: question.id })
      question.answers.forEach(answer => {
        const answerRef = this.db
          .collection(
            `quizzes/${newQuiz.name}/Level/${newQuiz.level}/multipleChoiceQuestions/${question.id}/answers`
          )
          .doc(answer.id)
        batch.set(answerRef.ref, { name: answer.name, correct: answer.correct })
      })
    })
    await batch.commit()
  }

  async deleteAttemptedQuiz (quiz: Quiz, questions: Question[]) {
    const batch = this.db.firestore.batch()
    questions.forEach(async question => {
      const answerRefs: firebase.default.firestore.QuerySnapshot = await this.db
        .collection(
          `quizzes/${quiz.name}/Level/${quiz.level}/multipleChoiceQuestions/${question.id}/answers`
        )
        .ref.get()
      answerRefs.forEach(doc => {
        batch.delete(doc.ref)
      })
    })
    const questionRefs = await this.db
      .collection(
        `quizzes/${quiz.name}/Level/${quiz.level}/multipleChoiceQuestions`
      )
      .ref.get()
    questionRefs.forEach(doc => {
      batch.delete(doc.ref)
    })
    const levelRef = this.db.doc(`quizzes/${quiz.name}/Level/${quiz.level}`).ref
    batch.delete(levelRef)
    const levels: firebase.default.firestore.QuerySnapshot = await this.db
      .collection(`quizzes/${quiz.name}/Level`)
      .ref.get()
    if (levels.size === 1) {
      const quizRef = this.db.doc(`quizzes/${quiz.name}`).ref
      batch.delete(quizRef)
    }
    await batch.commit()
  }
}
