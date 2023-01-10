import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { User } from 'src/app/shared/models/User'

@Component({
  selector: 'app-admin-default',
  templateUrl: './admin-default.component.html',
  styleUrls: ['./admin-default.component.scss']
})
export class AdminDefaultComponent implements OnInit {
  @Input() user: User

  constructor (private router: Router) {}

  ngOnInit () {
    if (!this.user.isAdmin) this.router.navigateByUrl('quizzes')
  }
}
