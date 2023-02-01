import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { FormGroup, FormArray } from '@angular/forms'
import { AttemptedQuiz } from 'src/app/shared/models/Quiz'
import { QuizService } from 'src/app/shared/services/quiz.service'
import { StoreService } from 'src/app/shared/services/store.service'

@Component({
  selector: 'app-level-item',
  templateUrl: './level-item.component.html',
  styleUrls: ['./level-item.component.scss']
})
export class LevelItemComponent implements OnInit {
  @Input() levelIndex: number
  @Input() tabs: string[]
  @Input() quizForm: FormGroup
  @Input() attemptedQuiz: AttemptedQuiz
  questions$ = this.storeService.questions$
  level: FormGroup = undefined

  constructor (
    private quizService: QuizService,
    private storeService: StoreService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit () {
    if (this.quizForm.value.language !== '') {
      this.quizService
        .initialQuestionsLoad(
          this.quizForm.value.language,
          this.quizForm.value.levels[this.levelIndex].levelName
        )
        .then(() => {
          const levels = this.quizForm.controls['levels'] as FormArray
          this.level = levels.controls[this.levelIndex] as FormGroup
          this.cd.detectChanges()
        })
    } else {
      const levels = this.quizForm.controls['levels'] as FormArray
      this.level = levels.controls[this.levelIndex] as FormGroup
      this.cd.detectChanges()
    }
  }

  updateLevel () {
    this.tabs[this.levelIndex] =
      this.quizForm.value.levels[this.levelIndex].levelName
  }
}
