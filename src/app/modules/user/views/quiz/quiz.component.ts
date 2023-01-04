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
import { StoreService } from 'src/app/shared/services/store.service'
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
    private storeService: StoreService
  ) {}

  language: string
  level: string
  questions$ = this.storeService.questions$
  attemptedQuiz$ = this.storeService.attemptedQuiz$
  user$ = this.storeService.user$
  allQuizzes$ = this.storeService.allQuizzes$
  index$ = new BehaviorSubject<number>(0)
  page: number

  ngOnInit (): void {
    this.language = this.route.snapshot.paramMap.get('language')
    this.level = this.route.snapshot.paramMap.get('level')
  }
}
