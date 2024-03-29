import { Component, ElementRef, ViewChild } from '@angular/core'
import { StoreService } from 'src/app/shared/services/store.service'

@Component({
  selector: 'app-all-quizzes',
  templateUrl: './all-quizzes.component.html',
  styleUrls: ['./all-quizzes.component.scss']
})
export class AllQuizzesComponent {
  constructor (private storeService: StoreService) {}
  allQuizzes$ = this.storeService.allQuizzes$
  user$ = this.storeService.user$
  @ViewChild('scrollContent') scrollContent: ElementRef

  onLeft () {
    this.scrollContent.nativeElement.scrollLeft -= 250
  }

  onRight () {
    this.scrollContent.nativeElement.scrollLeft += 250
  }
}
