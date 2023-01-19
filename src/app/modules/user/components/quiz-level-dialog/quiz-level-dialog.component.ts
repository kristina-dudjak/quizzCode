import { Component } from '@angular/core'
import { StoreService } from 'src/app/shared/services/store.service'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Inject } from '@angular/core'
import { QuizService } from 'src/app/shared/services/quiz.service'

@Component({
  selector: 'app-quiz-level-dialog',
  templateUrl: './quiz-level-dialog.component.html',
  styleUrls: ['./quiz-level-dialog.component.scss']
})
export class QuizLevelDialogComponent {
  constructor (
    private storeService: StoreService,
    private quizService: QuizService,
    @Inject(MAT_DIALOG_DATA) public data: boolean
  ) {}
  attemptedQuiz$ = this.storeService.attemptedQuiz$
  levels$ = this.storeService.levels$

  updateLevel (level: string, name: string) {
    this.storeService.updateLevelInAttemptedQuiz(level)
    this.quizService.initialQuestionsLoad(name, level)
  }
}
