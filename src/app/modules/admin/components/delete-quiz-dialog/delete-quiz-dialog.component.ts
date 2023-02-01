import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-delete-quiz-dialog',
  templateUrl: './delete-quiz-dialog.component.html',
  styleUrls: ['./delete-quiz-dialog.component.scss']
})
export class DeleteQuizDialogComponent {
  constructor (
    public dialogRef: MatDialogRef<DeleteQuizDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  deleteQuiz () {
    this.data.submitFunction()
    this.dialogRef.close()
  }
}
