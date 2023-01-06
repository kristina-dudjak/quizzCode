import { Component, Input, OnInit } from '@angular/core'
import { User } from 'src/app/shared/models/User'
import { UserService } from '../../services/user.service'

@Component({
  selector: 'app-solved-list',
  templateUrl: './solved-list.component.html',
  styleUrls: ['./solved-list.component.scss']
})
export class SolvedListComponent implements OnInit {
  constructor (private userService: UserService) {}
  @Input() user: User

  ngOnInit (): void {
    this.userService.getUserQuizLanguages(this.user)
  }
}
