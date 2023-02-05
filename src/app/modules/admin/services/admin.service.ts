import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor (private db: AngularFirestore) {}

  async deleteQuizLevel (quiz: any, levelIndex: number) {
    await quiz.levels.forEach(async level => {
      if (level.levelId === levelIndex) {
        level.questions.forEach(async question => {
          const answerRefs = await this.db
            .collection(
              `quizzes/${quiz.language}/Level/${
                level.levelName
              }/multipleChoiceQuestions/${question.questionId.toString()}/answers`
            )
            .ref.get()
          answerRefs.forEach(doc => {
            doc.ref.delete()
          })
        })
        const questionRefs = await this.db
          .collection(
            `quizzes/${quiz.language}/Level/${level.levelName}/multipleChoiceQuestions`
          )
          .ref.get()
        questionRefs.forEach(doc => {
          doc.ref.delete()
        })
        const levelRef = this.db.doc(
          `quizzes/${quiz.language}/Level/${level.levelName}`
        ).ref
        levelRef.delete()
      }
    })
  }
  async deleteQuiz (quiz: any, attemptedQuiz: string) {
    if (attemptedQuiz !== '') {
      const levelPromises = []
      quiz.levels.forEach(async level => {
        const questionPromises = []
        level.questions.forEach(async question => {
          const answerRefs = await this.db
            .collection(
              `quizzes/${attemptedQuiz}/Level/${
                level.levelName
              }/multipleChoiceQuestions/${question.questionId.toString()}/answers`
            )
            .ref.get()
          const answerPromises = []
          answerRefs.forEach(async doc => {
            answerPromises.push(await doc.ref.delete())
          })
          questionPromises.push(await Promise.all(answerPromises))
        })
        const questionRefs = await this.db
          .collection(
            `quizzes/${attemptedQuiz}/Level/${level.levelName}/multipleChoiceQuestions`
          )
          .ref.get()
        const questionDeletes = []
        questionRefs.forEach(async doc => {
          questionDeletes.push(await doc.ref.delete())
        })
        levelPromises.push(await Promise.all(questionPromises))
        levelPromises.push(await Promise.all(questionDeletes))
        const levelRef = this.db.doc(
          `quizzes/${attemptedQuiz}/Level/${level.levelName}`
        ).ref
        levelPromises.push(await levelRef.delete())
      })
      await Promise.all(levelPromises)
      const quizRef = this.db.doc(`quizzes/${attemptedQuiz}`).ref
      await quizRef.delete()
    }
  }

  async saveQuiz (quiz: any, attemptedQuiz: string) {
    if (attemptedQuiz !== '') {
      await this.deleteQuiz(quiz, attemptedQuiz)
    }

    const quizzesRef = this.db.collection('quizzes').doc(quiz.language)
    await quizzesRef.set({ thumbnail: quiz.thumbnail }, { merge: true })

    const levelPromises = []
    quiz.levels.forEach(async level => {
      const levelRef = quizzesRef.collection('Level').doc(level.levelName)
      await levelRef.set(
        { level: level.levelName, id: level.levelId },
        { merge: true }
      )

      const questionPromises = []
      level.questions.forEach(async question => {
        const questionRef = this.db
          .collection(
            `quizzes/${quiz.language}/Level/${level.levelName}/multipleChoiceQuestions`
          )
          .doc(question.questionId.toString())
        await questionRef.set(
          { name: question.questionName, id: question.questionId },
          { merge: true }
        )

        const answerPromises = []
        question.questionAnswers.forEach(async answer => {
          const answerRef = this.db
            .collection(
              `quizzes/${quiz.language}/Level/${
                level.levelName
              }/multipleChoiceQuestions/${question.questionId.toString()}/answers`
            )
            .doc(answer.answerId.toString())
          answerPromises.push(
            answerRef.set(
              { name: answer.answerName, correct: answer.answerCorrect },
              { merge: true }
            )
          )
        })
        questionPromises.push(Promise.all(answerPromises))
      })
      levelPromises.push(Promise.all(questionPromises))
    })
    await Promise.all(levelPromises)
  }
}
