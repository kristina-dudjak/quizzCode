import { Component, OnInit } from '@angular/core'
import { QuizService } from '../../services/quiz.service'

@Component({
  selector: 'app-quizzes',
  templateUrl: './quizzes.component.html',
  styleUrls: ['./quizzes.component.scss']
})
export class QuizzesComponent implements OnInit {
  constructor (private quizService: QuizService) {}

  ngOnInit (): void {
    // this.quizService.initialQuizzesLoad()
  }
}
