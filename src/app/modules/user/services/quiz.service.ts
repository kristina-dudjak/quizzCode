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
  addQuizToQuizzes (quiz: Quiz) {
    this.setState({ allQuizzes: this.state.allQuizzes.concat(quiz) })
  }

  initialQuizzesLoad () {
    firstValueFrom(
      this.db
        .collection('quizzes')
        .snapshotChanges()
        .pipe(
          tap(actions =>
            actions.map(({ payload: { doc } }: DocumentChangeAction<Quiz>) => {
              this.addQuizToQuizzes({
                name: doc.id,
                thumbnail: doc.data()['thumbnail']
              })
            })
          )
        )
    )
  }

  updateAttemptedQuiz (attemptedQuiz: Quiz) {
    this.setState({ attemptedQuiz })
  }

  updateLevelInAttemptedQuiz (_level: string) {
    const { level, ...rest } = this.state.attemptedQuiz
    this.setState({ attemptedQuiz: { level: _level, ...rest } })
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
