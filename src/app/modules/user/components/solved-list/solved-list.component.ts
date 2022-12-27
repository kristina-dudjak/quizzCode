import { Component, OnInit } from '@angular/core'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-solved-list',
  templateUrl: './solved-list.component.html',
  styleUrls: ['./solved-list.component.scss']
})
export class SolvedListComponent implements OnInit {
  constructor () {}

  quizzes$: any

  ngOnInit (): void {}
}
