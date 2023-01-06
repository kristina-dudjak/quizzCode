import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { QuizResultDialogComponent } from '../quiz-result-dialog/quiz-result-dialog.component'

@Component({
  selector: 'app-confirm-submit-dialog',
  templateUrl: './confirm-submit-dialog.component.html',
  styleUrls: ['./confirm-submit-dialog.component.scss']
})
export class ConfirmSubmitDialogComponent implements OnInit {
  constructor (private dialog: MatDialog, private router: Router) {}

  ngOnInit (): void {}

  showResult () {
    this.dialog.open(QuizResultDialogComponent, { disableClose: true })
    // this.router.navigateByUrl('quizzes')
  }
}
