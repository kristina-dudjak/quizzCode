import { Component } from '@angular/core'
import { StoreService } from 'src/app/shared/services/store.service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  constructor (private storeService: StoreService) {}
  user$ = this.storeService.user$
  levels$ = this.storeService.levels$
  attemptedQuiz$ = this.storeService.attemptedQuiz$
  questions$ = this.storeService.questions$
}
