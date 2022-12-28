import { Component, Input } from '@angular/core'
import { Quiz } from 'src/app/shared/models/Quiz'

@Component({
  selector: 'app-available-quiz',
  templateUrl: './available-quiz.component.html',
  styleUrls: ['./available-quiz.component.scss']
})
export class AvailableQuizComponent {
  @Input() availableQuiz: Quiz
}
