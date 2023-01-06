import { Component, OnInit } from '@angular/core'
import { StoreService } from 'src/app/shared/services/store.service'
import { QuizService } from '../../services/quiz.service'

@Component({
  selector: 'app-quizzes-default',
  templateUrl: './quizzes-default.component.html',
  styleUrls: ['./quizzes-default.component.scss']
})
export class QuizzesDefaultComponent implements OnInit {
  constructor (
    private quizService: QuizService,
    private storeService: StoreService
  ) {}

  user$ = this.storeService.user$
  levels$ = this.storeService.levels$

  ngOnInit (): void {
    this.quizService.initialQuizzesLoad()
  }
}
