import { Component, OnInit } from '@angular/core'
import { AuthService } from './modules/auth/services/auth.service'
import { IconsService } from './shared/services/icons.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor (
    private iconsService: IconsService,
    private authService: AuthService
  ) {}
  user$ = this.authService.user$

  ngOnInit () {
    this.iconsService.addIcons()
  }
}
