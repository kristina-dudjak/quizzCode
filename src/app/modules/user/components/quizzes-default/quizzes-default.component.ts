import { Component, OnInit } from '@angular/core'
import { QuizService } from '../../services/quiz.service'

@Component({
  selector: 'app-quizzes-default',
  templateUrl: './quizzes-default.component.html',
  styleUrls: ['./quizzes-default.component.scss']
})
export class QuizzesDefaultComponent implements OnInit {
  constructor (private quizService: QuizService) {}

  ngOnInit (): void {
    this.quizService.initialQuizzesLoad()
  }
}
