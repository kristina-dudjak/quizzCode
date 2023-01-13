import { Component } from '@angular/core'
import { StoreService } from 'src/app/shared/services/store.service'

@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.scss']
})
export class NewQuizComponent {
  constructor (private storeService: StoreService) {}
  questions$ = this.storeService.questions$
  attemptedQuiz$ = this.storeService.attemptedQuiz$
}
