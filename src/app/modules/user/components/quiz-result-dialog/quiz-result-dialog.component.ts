import { Component } from '@angular/core'
import { UserService } from '../../services/user.service'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Inject } from '@angular/core'
import { StoreService } from 'src/app/shared/services/store.service'
@Component({
  selector: 'app-quiz-result-dialog',
  templateUrl: './quiz-result-dialog.component.html',
  styleUrls: ['./quiz-result-dialog.component.scss']
})
export class QuizResultDialogComponent {
  constructor (
    private userService: UserService,
    private storeService: StoreService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  attemptedQuiz$ = this.storeService.attemptedQuiz$

  tryAgain () {
    this.userService.loadAttemptedQuiz(
      this.data.attemptedQuiz.name,
      this.data.attemptedQuiz.level,
      this.data.user,
      this.data.allQuizzes,
      this.data.questions
    )
  }
}
