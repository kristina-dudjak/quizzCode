import { Component, Input } from '@angular/core'
import { AttemptedQuiz } from 'src/app/shared/models/Quiz'

@Component({
  selector: 'app-solved-item',
  templateUrl: './solved-item.component.html',
  styleUrls: ['./solved-item.component.scss']
})
export class SolvedItemComponent {
  @Input() solvedQuiz: AttemptedQuiz

  setDefaultImg () {
    this.solvedQuiz.thumbnail = 'assets/not-found.png'
  }
}
