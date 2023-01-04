import { Component } from '@angular/core'
import { StoreService } from 'src/app/shared/services/store.service'
import { QuizService } from '../../services/quiz.service'

@Component({
  selector: 'app-all-quizzes',
  templateUrl: './all-quizzes.component.html',
  styleUrls: ['./all-quizzes.component.scss']
})
export class AllQuizzesComponent {
  constructor (private storeService: StoreService) {}
  quizzes$ = this.storeService.allQuizzes$
}
