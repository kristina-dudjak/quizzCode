import { Component } from '@angular/core'
import { StoreService } from 'src/app/shared/services/store.service'
import { QuizService } from '../../services/quiz.service'

@Component({
  selector: 'app-quiz-level-dialog',
  templateUrl: './quiz-level-dialog.component.html',
  styleUrls: ['./quiz-level-dialog.component.scss']
})
export class QuizLevelDialogComponent {
  constructor (private storeService: StoreService) {}
  attemptedQuiz$ = this.storeService.attemptedQuiz$
  levels$ = this.storeService.levels$

  updateLevel (level: string) {
    this.storeService.updateLevelInAttemptedQuiz(level)
  }
}
