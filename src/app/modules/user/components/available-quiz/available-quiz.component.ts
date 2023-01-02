import { Component, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Quiz } from 'src/app/shared/models/Quiz'
import { QuizService } from '../../services/quiz.service'
import { QuizLevelDialogComponent } from '../quiz-level-dialog/quiz-level-dialog.component'

@Component({
  selector: 'app-available-quiz',
  templateUrl: './available-quiz.component.html',
  styleUrls: ['./available-quiz.component.scss']
})
export class AvailableQuizComponent {
  constructor (private dialog: MatDialog, private quizService: QuizService) {}

  attemptedQuiz$ = this.quizService.attemptedQuiz$
  @Input() availableQuiz: Quiz

  chooseLevel () {
    this.quizService.updateAttemptedQuiz({
      name: this.availableQuiz.name,
      thumbnail: this.availableQuiz.thumbnail,
      questions: []
    })
    this.quizService.loadQuizLevels(this.availableQuiz.name)
    this.dialog.open(QuizLevelDialogComponent)
  }
}
