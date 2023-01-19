import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/modules/auth/services/auth.service'
import { User } from '../../models/User'
import { StoreService } from '../../services/store.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor (
    private authService: AuthService,
    private router: Router,
    private storeService: StoreService
  ) {}

  @Input() user: User

  goToAdmin () {
    this.storeService.updateAttemptedQuiz({
      name: '',
      level: '',
      thumbnail: '',
      isCompleted: false
    })
    this.router.navigateByUrl('admin')
  }

  async signOut () {
    await this.authService.signOut()
  }
}
