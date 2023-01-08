import { Component, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Quiz } from 'src/app/shared/models/Quiz'
import { StoreService } from 'src/app/shared/services/store.service'
import { QuizService } from '../../services/quiz.service'
import { QuizLevelDialogComponent } from '../quiz-level-dialog/quiz-level-dialog.component'

@Component({
  selector: 'app-available-quiz',
  templateUrl: './available-quiz.component.html',
  styleUrls: ['./available-quiz.component.scss']
})
export class AvailableQuizComponent {
  constructor (
    private dialog: MatDialog,
    private storeService: StoreService,
    private quizService: QuizService
  ) {}

  @Input() availableQuiz: Quiz

  chooseLevel () {
    this.storeService.updateAttemptedQuiz({
      name: this.availableQuiz.name,
      thumbnail: this.availableQuiz.thumbnail,
      isCompleted: false,
      questions: []
    })
    this.quizService.loadQuizLevels(this.availableQuiz.name)
    this.dialog.open(QuizLevelDialogComponent)
  }
}
