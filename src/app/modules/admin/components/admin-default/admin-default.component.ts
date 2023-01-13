import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AttemptedQuiz } from 'src/app/shared/models/Quiz'
import { User } from 'src/app/shared/models/User'
import { StoreService } from 'src/app/shared/services/store.service'

@Component({
  selector: 'app-admin-default',
  templateUrl: './admin-default.component.html',
  styleUrls: ['./admin-default.component.scss']
})
export class AdminDefaultComponent implements OnInit {
  @Input() user: User
  @Input() attemptedQuiz: AttemptedQuiz
  questions$ = this.storeService.questions$

  constructor (private router: Router, private storeService: StoreService) {}

  ngOnInit () {
    if (!this.user.isAdmin) this.router.navigateByUrl('quizzes')
    console.log(this.attemptedQuiz)
  }
}
