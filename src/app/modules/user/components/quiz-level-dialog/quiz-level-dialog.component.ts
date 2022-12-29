import { Component } from '@angular/core'
import { QuizService } from '../../services/quiz.service'

@Component({
  selector: 'app-quiz-level-dialog',
  templateUrl: './quiz-level-dialog.component.html',
  styleUrls: ['./quiz-level-dialog.component.scss']
})
export class QuizLevelDialogComponent {
  constructor (private quizService: QuizService) {}
  attemptedQuiz$ = this.quizService.attemptedQuiz$
  levels$ = this.quizService.levels$

  updateLevel (level: string) {
    this.quizService.updateLevelInAttemptedQuiz(level)
  }
}
