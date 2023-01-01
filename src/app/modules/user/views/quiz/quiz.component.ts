import { Component, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormControl } from '@angular/forms'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject, map } from 'rxjs'
import { AuthService } from 'src/app/modules/auth/services/auth.service'
import { Question } from 'src/app/shared/models/Question'
import { User } from 'src/app/shared/models/User'
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
    private authService: AuthService
  ) {}

  language: string
  level: string
  questions$ = this.quizService.questions$
  user$ = this.authService.user$
  index$ = new BehaviorSubject<number>(0)

  userQuestion: Question = {
    name: '',
    id: '',
    answers: []
  }

  handlePageEvent (e: PageEvent) {
    this.index$.next(e.pageIndex)
    this.userQuestion.answers = []
  }

  questionForm = this.formBuilder.group({
    answers: this.formBuilder.array([])
  })

  onCheckboxChange (e, questions: Question[], user: User) {
    const answers = this.questionForm.get('answers') as FormArray
    if (e.target.checked) {
      answers.push(new FormControl(e.target.value))
      this.userQuestion.answers.push(
        questions[this.index$.value].answers.find(
          an => an.name == e.target.value
        )
      )
    } else {
      let i = 0
      answers.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          answers.removeAt(i)
          this.userQuestion.answers = this.userQuestion.answers.filter(
            answer => answer.name !== e.target.value
          )
          return
        }
        i++
      })
    }
    this.userQuestion.name = questions[this.index$.value].name
    this.userQuestion.id = questions[this.index$.value].id
    this.quizService.addQuestionToAttemptedQuiz(this.userQuestion)
    this.quizService.saveQuiz(this.userQuestion, user)
  }

  currentNumberChanged$ = this.quizService.attemptedQuiz$.pipe(
    map(a => console.log(a))
  )

  ngOnInit (): void {
    this.language = this.route.snapshot.paramMap.get('language')
    this.level = this.route.snapshot.paramMap.get('level')
    this.quizService.initialQuestionsLoad(this.language, this.level)
    // this.quizService.loadAttemptedQuiz(this.language)
    // this.quizService.updateQuestionsInAttemptedQuiz()
  }
}
