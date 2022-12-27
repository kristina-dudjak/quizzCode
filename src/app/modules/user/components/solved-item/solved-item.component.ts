import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-solved-item',
  templateUrl: './solved-item.component.html',
  styleUrls: ['./solved-item.component.scss']
})
export class SolvedItemComponent implements OnInit {
  constructor () {}

  @Input() solvedQuiz: any

  ngOnInit (): void {}
}
