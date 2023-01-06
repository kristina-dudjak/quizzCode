import { Component, Input, OnInit } from '@angular/core'
import { AttemptedQuiz } from 'src/app/shared/models/Quiz'

@Component({
  selector: 'app-solved-item',
  templateUrl: './solved-item.component.html',
  styleUrls: ['./solved-item.component.scss']
})
export class SolvedItemComponent implements OnInit {
  constructor () {}

  @Input() solvedQuiz: AttemptedQuiz

  ngOnInit (): void {}
}
