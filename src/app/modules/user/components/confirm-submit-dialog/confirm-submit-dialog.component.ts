import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { AttemptedQuiz } from 'src/app/shared/models/Quiz'
import { User } from 'src/app/shared/models/User'
import { StoreService } from 'src/app/shared/services/store.service'
import { UserService } from '../../services/user.service'
import { QuizResultDialogComponent } from '../quiz-result-dialog/quiz-result-dialog.component'

@Component({
  selector: 'app-confirm-submit-dialog',
  templateUrl: './confirm-submit-dialog.component.html',
  styleUrls: ['./confirm-submit-dialog.component.scss']
})
export class ConfirmSubmitDialogComponent {
  constructor (
    private dialog: MatDialog,
    private userService: UserService,
    private storeService: StoreService
  ) {}
  attemptedQuiz$ = this.storeService.attemptedQuiz$
  user$ = this.storeService.user$

  showResult (attemptedQuiz: AttemptedQuiz, user: User) {
    this.dialog.open(QuizResultDialogComponent, { disableClose: true })
    this.userService.saveQuizScore(attemptedQuiz, user)
  }
}
