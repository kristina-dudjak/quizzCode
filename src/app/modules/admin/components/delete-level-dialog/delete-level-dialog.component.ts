import { Component } from '@angular/core'
import { Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-delete-level-dialog',
  templateUrl: './delete-level-dialog.component.html',
  styleUrls: ['./delete-level-dialog.component.scss']
})
export class DeleteLevelDialogComponent {
  constructor (
    public dialogRef: MatDialogRef<DeleteLevelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  deleteLevel () {
    this.data.submitFunction()
    this.dialogRef.close()
  }
}
