import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { Answer } from 'src/app/shared/models/Answer'
import { Question } from 'src/app/shared/models/Question'
import { AttemptedQuiz, Quiz } from 'src/app/shared/models/Quiz'
import { User } from 'src/app/shared/models/User'
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

  handlePageEvent (e: PageEvent) {
    this.page = e.pageIndex
    this.index$.next(this.page)
    this.userService.loadAttemptedQuiz(
      this.language,
      this.level,
      this.user,
      this.allQuizzes,
      this.questions
    )
  }

  onButtonChange (questions: Question[], answer: Answer) {
    this.userService.saveQuizQuestion(
      {
        name: questions[this.index$.value].name,
        id: questions[this.index$.value].id,
        answers: [answer]
      },
      this.user,
      this.attemptedQuiz
    )
  }

  isChecked (question: Question, userQuestions: Question[], answerName: string) {
    return userQuestions.some(
      q =>
        q.name === question.name &&
        q.answers.some(ans => ans.name === answerName)
    )
  }
  confirm () {
    this.dialog.open(ConfirmSubmitDialogComponent)
  }

  ngOnInit (): void {
    this.language = this.route.snapshot.paramMap.get('language')
    this.level = this.route.snapshot.paramMap.get('level')
    this.userService.loadAttemptedQuiz(
      this.language,
      this.level,
      this.user,
      this.allQuizzes,
      this.questions
    )
  }
}
