import { Component, Input } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Quiz } from 'src/app/shared/models/Quiz'
import { User } from 'src/app/shared/models/User'
import { QuizService } from 'src/app/shared/services/quiz.service'
import { StoreService } from 'src/app/shared/services/store.service'
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
  @Input() user: User

  chooseLevel () {
    this.storeService.updateAttemptedQuiz({
      name: this.availableQuiz.name,
      thumbnail: this.availableQuiz.thumbnail,
      isCompleted: false,
      questions: []
    })
    this.quizService.loadQuizLevels(this.availableQuiz.name)
    this.dialog.open(QuizLevelDialogComponent, { data: this.user.isAdmin })
  }

  setDefaultImg () {
    this.availableQuiz.thumbnail = 'assets/not-found.png'
  }
}
