import { Component, OnInit } from '@angular/core'
import { IconsService } from './shared/services/icons.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor (private iconsService: IconsService) {}

  ngOnInit () {
    this.iconsService.addIcons()
  }
}
