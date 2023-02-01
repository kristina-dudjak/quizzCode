import { Injectable } from '@angular/core'
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { QuizService } from 'src/app/shared/services/quiz.service'

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor (private db: AngularFirestore, private quizService: QuizService) {}

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
    if (attemptedQuiz != '') {
      await quiz.levels.forEach(async level => {
        level.questions.forEach(async question => {
          const answerRefs: firebase.default.firestore.QuerySnapshot =
            await this.db
              .collection(
                `quizzes/${attemptedQuiz}/Level/${
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
            `quizzes/${attemptedQuiz}/Level/${level.levelName}/multipleChoiceQuestions`
          )
          .ref.get()
        questionRefs.forEach(doc => {
          doc.ref.delete()
        })
        const levelRef = this.db.doc(
          `quizzes/${attemptedQuiz}/Level/${level.levelName}`
        ).ref
        levelRef.delete()
      })
      const quizRef = this.db.doc(`quizzes/${attemptedQuiz}`).ref
      quizRef.delete()
    }
  }

  async saveQuiz (quiz: any, attemptedQuiz: string) {
    const writeBatch = this.db.firestore.batch()
    if (attemptedQuiz != '' && attemptedQuiz !== quiz.language) {
      await this.deleteQuiz(quiz, attemptedQuiz)
    }

    const levelPromises = []
    quiz.levels.forEach(level => {
      console.log(level)
      const quizzesRef = this.db.collection('quizzes').doc(quiz.language)
      writeBatch.set(
        quizzesRef.ref,
        { thumbnail: quiz.thumbnail },
        { merge: true }
      )
      const levelRef = quizzesRef.collection('Level').doc(level.levelName)
      writeBatch.set(
        levelRef.ref,
        { level: level.levelName, id: level.levelId },
        { merge: true }
      )

      const questionPromises = []
      level.questions.forEach(question => {
        const questionRef = this.db
          .collection(
            `quizzes/${quiz.language}/Level/${level.levelName}/multipleChoiceQuestions`
          )
          .doc(question.questionId.toString())
        writeBatch.set(
          questionRef.ref,
          {
            name: question.questionName,
            id: question.questionId
          },
          { merge: true }
        )

        const answerPromises = []
        question.questionAnswers.forEach(answer => {
          const answerRef = this.db
            .collection(
              `quizzes/${quiz.language}/Level/${
                level.levelName
              }/multipleChoiceQuestions/${question.questionId.toString()}/answers`
            )
            .doc(answer.answerId.toString())
          writeBatch.set(
            answerRef.ref,
            {
              name: answer.answerName,
              correct: answer.answerCorrect
            },
            { merge: true }
          )

          answerPromises.push(
            answerRef.set(
              {
                name: answer.answerName,
                correct: answer.answerCorrect
              },
              { merge: true }
            )
          )
        })
        questionPromises.push(Promise.all(answerPromises))
      })
      levelPromises.push(Promise.all(questionPromises))
    })
    await Promise.all(levelPromises)
    await writeBatch.commit()
  }

  async renameQuizLevel (oldName: string, newName: string, quiz: any) {
    await this.deleteOldLevel(oldName, newName, quiz)
    await quiz.levels.forEach(async level => {
      console.log(level)
      if (
        level.levelName === newName &&
        level.questions[0].questionName !== '' &&
        level.questions[0].questionAnswers[0].answerName !== '' &&
        level.questions[0].questionAnswers[1].answerName !== ''
      ) {
        await this.db
          .collection(`quizzes/${quiz.language}/Level`)
          .doc(newName)
          .set({ level: newName, id: level.levelId }, { merge: true })
        await level.questions.forEach(async question => {
          await this.db
            .collection(
              `quizzes/${quiz.language}/Level/${newName}/multipleChoiceQuestions`
            )
            .doc(question.questionId.toString())
            .set(
              {
                name: question.questionName,
                id: question.questionId
              },
              { merge: true }
            )
          await question.questionAnswers.forEach(async answer => {
            await this.db
              .collection(
                `quizzes/${
                  quiz.language
                }/Level/${newName}/multipleChoiceQuestions/${question.questionId.toString()}/answers`
              )
              .doc(answer.answerId.toString())
              .set(
                {
                  name: answer.answerName,
                  correct: answer.answerCorrect
                },
                { merge: true }
              )
          })
        })
      }
    })
  }

  async deleteOldLevel (oldName: string, newName: string, quiz: any) {
    await quiz.levels.forEach(async level => {
      if (level.levelName === newName) {
        await level.questions.forEach(async question => {
          const answerRefs = await this.db
            .collection(
              `quizzes/${
                quiz.language
              }/Level/${oldName}/multipleChoiceQuestions/${question.questionId.toString()}/answers`
            )
            .ref.get()
          answerRefs.forEach(async doc => {
            await doc.ref.delete()
          })
        })
        const questionRefs = await this.db
          .collection(
            `quizzes/${quiz.language}/Level/${oldName}/multipleChoiceQuestions`
          )
          .ref.get()
        questionRefs.forEach(async doc => {
          await doc.ref.delete()
        })
        const levelRef = this.db.doc(
          `quizzes/${quiz.language}/Level/${oldName}`
        ).ref
        levelRef.delete()
      }
    })
  }
}
