import { Component, OnInit } from '@angular/core'
import { AuthService } from './modules/auth/services/auth.service'
import { IconsService } from './shared/services/icons.service'
import { StoreService } from './shared/services/store.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor (
    private iconsService: IconsService,
    private storeService: StoreService
  ) {}
  user$ = this.storeService.user$

  ngOnInit () {
    this.iconsService.addIcons()
  }
}
