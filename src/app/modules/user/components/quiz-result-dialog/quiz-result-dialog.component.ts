import { Component, OnInit } from '@angular/core'
import { StoreService } from 'src/app/shared/services/store.service'

@Component({
  selector: 'app-quiz-result-dialog',
  templateUrl: './quiz-result-dialog.component.html',
  styleUrls: ['./quiz-result-dialog.component.scss']
})
export class QuizResultDialogComponent implements OnInit {
  constructor (private storeService: StoreService) {}

  attemptedQuiz$ = this.storeService.attemptedQuiz$

  ngOnInit (): void {
    // this.authService.calculate()
  }

  tryAgain () {}
}
