import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { Answer } from 'src/app/shared/models/Answer'
import { Question } from 'src/app/shared/models/Question'
import { AttemptedQuiz, Quiz } from 'src/app/shared/models/Quiz'
import { User } from 'src/app/shared/models/User'
import { QuizService } from '../../services/quiz.service'
import { UserService } from '../../services/user.service'
import { ConfirmSubmitDialogComponent } from '../confirm-submit-dialog/confirm-submit-dialog.component'

@Component({
  selector: 'app-quiz-default',
  templateUrl: './quiz-default.component.html',
  styleUrls: ['./quiz-default.component.scss']
})
export class QuizDefaultComponent implements OnInit {
  constructor (
    private route: ActivatedRoute,
    private quizService: QuizService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  @Input() user: User
  @Input() attemptedQuiz: AttemptedQuiz
  @Input() allQuizzes: Quiz[]
  @Input() questions: Question[]
  index$ = new BehaviorSubject<number>(0)
  page: number
  language: string
  level: string
  userQuestion: Question = {
    name: '',
    id: '',
    answers: []
  }

  handlePageEvent (e: PageEvent) {
    this.page = e.pageIndex
    this.index$.next(this.page)
    this.userQuestion.answers = []
    this.userService.loadAttemptedQuiz(
      this.language,
      this.level,
      this.user,
      this.allQuizzes,
      this.questions
    )
  }

  questionForm = this.formBuilder.group({
    answers: this.formBuilder.array([])
  })

  onButtonChange (questions: Question[], user: User, answer: Answer) {
    this.userQuestion.answers = []
    this.userService.loadAttemptedQuiz(
      this.language,
      this.level,
      this.user,
      this.allQuizzes,
      this.questions
    )
    this.userQuestion.name = questions[this.index$.value].name
    this.userQuestion.id = questions[this.index$.value].id
    this.userQuestion.answers.push(answer)
    this.userService.saveQuizQuestion(
      this.userQuestion,
      this.user,
      this.attemptedQuiz
    )
  }

  isChecked (question: Question, userQuestions: Question[], answerName: string) {
    if (
      userQuestions.length === 0 ||
      !userQuestions.find(q => q.name === question.name)
    )
      return false
    return userQuestions
      .find(ques => ques.name === question.name)
      .answers.some(ans => ans.name === answerName)
  }

  confirm () {
    this.dialog.open(ConfirmSubmitDialogComponent)
  }

  ngOnInit (): void {
    this.language = this.route.snapshot.paramMap.get('language')
    this.level = this.route.snapshot.paramMap.get('level')
    this.quizService.initialQuestionsLoad(this.language, this.level)
    this.userService.loadAttemptedQuiz(
      this.language,
      this.level,
      this.user,
      this.allQuizzes,
      this.questions
    )
  }
}
