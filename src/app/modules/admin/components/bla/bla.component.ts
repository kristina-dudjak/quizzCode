import { Component, OnInit } from '@angular/core'
import { AuthService } from 'src/app/modules/auth/services/auth.service'

@Component({
  selector: 'app-bla',
  templateUrl: './bla.component.html',
  styleUrls: ['./bla.component.scss']
})
export class BlaComponent implements OnInit {
  constructor (private authService: AuthService) {}

  ngOnInit (): void {}

  signOut () {
    this.authService.signOut()
  }
}
