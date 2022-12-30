import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { PageEvent } from '@angular/material/paginator'
import { ActivatedRoute } from '@angular/router'
import { BehaviorSubject } from 'rxjs'
import { QuizService } from '../../services/quiz.service'

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  constructor (
    private route: ActivatedRoute,
    private quizService: QuizService,
    private _formBuilder: FormBuilder
  ) {}

  language: string
  level: string
  questions$ = this.quizService.questions$
  index$ = new BehaviorSubject<number>(0)
  answers = this._formBuilder.group({})

  handlePageEvent (e: PageEvent) {
    this.index$.next(e.pageIndex)
  }

  ngOnInit (): void {
    this.language = this.route.snapshot.paramMap.get('language')
    this.level = this.route.snapshot.paramMap.get('level')
    this.quizService.initialQuestionsLoad(this.language, this.level)
  }
}
