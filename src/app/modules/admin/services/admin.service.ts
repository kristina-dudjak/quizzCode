import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Quiz } from 'src/app/shared/models/Quiz'

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor (private db: AngularFirestore) {}

  saveNewQuizToDb (newQuiz: Quiz) {
    console.log(newQuiz)
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
        .doc(question.id)
        .set({ name: question.name }, { merge: true })
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
}
