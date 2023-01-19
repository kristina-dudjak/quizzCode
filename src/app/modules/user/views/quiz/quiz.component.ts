import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { QuizService } from 'src/app/shared/services/quiz.service'
import { StoreService } from 'src/app/shared/services/store.service'

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  constructor (
    private route: ActivatedRoute,
    private storeService: StoreService,
    private quizService: QuizService
  ) {}

  language: string
  level: string
  questions$ = this.storeService.questions$
  attemptedQuiz$ = this.storeService.attemptedQuiz$
  user$ = this.storeService.user$
  allQuizzes$ = this.storeService.allQuizzes$

  ngOnInit () {
    this.language = this.route.snapshot.paramMap.get('language')
    this.level = this.route.snapshot.paramMap.get('level')
    this.quizService.initialQuizzesLoad()
    this.quizService.initialQuestionsLoad(this.language, this.level)
  }
}
