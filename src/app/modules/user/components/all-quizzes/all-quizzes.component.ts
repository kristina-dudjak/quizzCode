import { Component } from '@angular/core'
import { QuizService } from '../../services/quiz.service'

@Component({
  selector: 'app-all-quizzes',
  templateUrl: './all-quizzes.component.html',
  styleUrls: ['./all-quizzes.component.scss']
})
export class AllQuizzesComponent {
  constructor (private quizService: QuizService) {}
  quizzes$ = this.quizService.allQuizzes$
}
