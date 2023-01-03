import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject, map } from 'rxjs'
import { AuthService } from 'src/app/modules/auth/services/auth.service'
import { Answer } from 'src/app/shared/models/Answer'
import { Question } from 'src/app/shared/models/Question'
import { User } from 'src/app/shared/models/User'
import { ConfirmSubmitDialogComponent } from '../../components/confirm-submit-dialog/confirm-submit-dialog.component'
import { QuizService } from '../../services/quiz.service'

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  constructor (
    private route: ActivatedRoute,
    private quizService: QuizService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  language: string
  level: string
  questions$ = this.quizService.questions$
  attemptedQuiz$ = this.quizService.attemptedQuiz$
  user$ = this.authService.user$
  index$ = new BehaviorSubject<number>(0)
  user: User
  page: number

  userQuestion: Question = {
    name: '',
    id: '',
    answers: []
  }

  handlePageEvent (e: PageEvent) {
    this.page = e.pageIndex
    this.index$.next(this.page)
    this.userQuestion.answers = []
    this.quizService.loadAttemptedQuiz(this.language, this.user, this.level)
  }

  questionForm = this.formBuilder.group({
    answers: this.formBuilder.array([])
  })

  onButtonChange (questions: Question[], user: User, answer: Answer) {
    this.quizService.loadAttemptedQuiz(this.language, this.user, this.level)
    this.userQuestion.name = questions[this.index$.value].name
    this.userQuestion.id = questions[this.index$.value].id
    this.userQuestion.answers.push(answer)
    this.quizService.saveQuizQuestion(this.userQuestion, user)
    this.userQuestion.answers = []
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
    this.authService.user$.subscribe(user => {
      this.user = user
    })
    this.quizService.loadAttemptedQuiz(this.language, this.user, this.level)
  }
}
