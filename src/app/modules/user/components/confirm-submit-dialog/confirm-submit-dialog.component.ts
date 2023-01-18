import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { UserService } from '../../services/user.service'
import { QuizResultDialogComponent } from '../quiz-result-dialog/quiz-result-dialog.component'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Inject } from '@angular/core'

@Component({
  selector: 'app-confirm-submit-dialog',
  templateUrl: './confirm-submit-dialog.component.html',
  styleUrls: ['./confirm-submit-dialog.component.scss']
})
export class ConfirmSubmitDialogComponent {
  constructor (
    private dialog: MatDialog,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async showResult () {
    await this.userService.saveQuizScore(
      this.data.attemptedQuiz,
      this.data.user
    )
    this.dialog.open(QuizResultDialogComponent, {
      disableClose: true,
      data: {
        attemptedQuiz: this.data.attemptedQuiz,
        user: this.data.user,
        allQuizzes: this.data.allQuizzes,
        questions: this.data.questions
      }
    })
  }
}
