import { Injectable } from '@angular/core'
import {
  AngularFirestore,
  DocumentChangeAction
} from '@angular/fire/compat/firestore'
import { firstValueFrom, map, tap } from 'rxjs'
import { Store } from 'src/app/shared/classes/store.class'
import { Answer } from 'src/app/shared/models/Answer'
import { Question } from 'src/app/shared/models/Question'
import { AttemptedQuiz, Quiz } from 'src/app/shared/models/Quiz'
import { User } from 'src/app/shared/models/User'

interface QuizInterface {
  allQuizzes: Quiz[]
  attemptedQuiz: AttemptedQuiz
  levels: string[]
  questions: Question[]
}

const initialState: QuizInterface = {
  allQuizzes: [],
  attemptedQuiz: undefined,
  levels: [],
  questions: []
}

@Injectable({
  providedIn: 'root'
})
export class QuizService extends Store<QuizInterface> {
  constructor (private db: AngularFirestore) {
    super(initialState)
  }

  allQuizzes$ = this.select(({ allQuizzes }) => allQuizzes)
  attemptedQuiz$ = this.select(({ attemptedQuiz }) => attemptedQuiz)
  levels$ = this.select(({ levels }) => levels)
  questions$ = this.select(({ questions }) => questions)

  updateLevelsState (levels: string[]) {
    this.setState({ levels })
  }
  updateQuestionsState (questions: Question[]) {
    this.setState({ questions })
  }

  updateAllQuizzes (allQuizzes: Quiz[]) {
    this.setState({ allQuizzes })
  }

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
    )
    this.updateAllQuizzes(quizzes)
  }

  loadAttemptedQuiz (language: string, user: User, level: string) {
    firstValueFrom(
      this.db
        .doc(`users/${user.uid}/solvedQuizzes/${language}`)
        .get()
        .pipe(
          map(doc => {
            if (!doc.exists)
              this.updateAttemptedQuiz({
                name: language,
                level: level,
                thumbnail: '',
                questions: []
              })
            else {
              this.updateAttemptedQuiz({
                name: doc.id,
                level: doc.data()['level'],
                thumbnail: doc.data()['thumbnail'],
                questions: this.getAttemptedQuizQuestions(language, user)
              })
            }
          })
        )
    )
  }

  updateAttemptedQuiz (attemptedQuiz: AttemptedQuiz) {
    this.setState({
      attemptedQuiz: {
        name: attemptedQuiz.name,
        level: attemptedQuiz.level,
        thumbnail: attemptedQuiz.thumbnail,
        questions: attemptedQuiz.questions
      }
    })
  }

  updateLevelInAttemptedQuiz (_level: string) {
    const { level, ...rest } = this.state.attemptedQuiz
    this.setState({ attemptedQuiz: { level: _level, ...rest } })
  }

  saveQuiz (user: User) {
    this.db
      .collection(`users/${user.uid}/solvedQuizzes`)
      .doc(this.state.attemptedQuiz.name)
      .set(
        {
          level: this.state.attemptedQuiz.level
        },
        { merge: true }
      )
  }

  removeQuizQuestion (question: Question, user: User) {
    this.db
      .collection(
        `users/${user.uid}/solvedQuizzes/${this.state.attemptedQuiz.name}/questions`
      )
      .doc(question.name)
      .set(
        {
          name: question.name,
          answers: this.state.attemptedQuiz.questions
            .find(qu => qu.name === question.name)
            .answers.filter(answer => answer.name !== question.answers[0].name)
        },
        { merge: true }
      )
  }

  saveQuizQuestion (question: Question, user: User) {
    // if (
    //   !this.state.attemptedQuiz.questions.find(q => q.name === question.name)
    // ) {
    this.saveQuiz(user)
    this.db
      .collection(
        `users/${user.uid}/solvedQuizzes/${this.state.attemptedQuiz.name}/questions`
      )
      .doc(question.name)
      .set(
        {
          name: question.name,
          answers: question.answers
        },
        { merge: true }
      )
    // }
    // else {
    //   this.db
    //     .collection(
    //       `users/${user.uid}/solvedQuizzes/${this.state.attemptedQuiz.name}/questions`
    //     )
    //     .doc(question.name)
    //     .set(
    //       {
    //         name: question.name,
    //         answers: this.state.attemptedQuiz.questions
    //           .find(q => q.name === question.name)
    //           .answers.concat(question.answers)
    //       },
    //       { merge: true }
    //     )
    // }
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
    )
    this.updateLevelsState(levels)
  }

  initialQuestionsLoad (language: string, level: string) {
    const questions: Question[] = []
    firstValueFrom(
      this.db
        .collection(
          `quizzes/${language}/Level/${level}/multipleChoiceQuestions`
        )
        .snapshotChanges()
        .pipe(
          map(actions =>
            actions.map(
              ({ payload: { doc } }: DocumentChangeAction<unknown>) => {
                questions.push({
                  id: doc.id,
                  name: doc.data()['name'],
                  answers: this.getAnswers(language, level, doc.id)
                })
              }
            )
          )
        )
    )
    this.updateQuestionsState(questions)
  }

  getAttemptedQuizQuestions (language: string, user: User) {
    const questions: Question[] = []
    firstValueFrom(
      this.db
        .collection(`users/${user.uid}/solvedQuizzes/${language}/questions`)
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

  getAnswers (language: string, level: string, questionId: string) {
    const answers: Answer[] = []
    firstValueFrom(
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
