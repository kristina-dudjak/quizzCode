import { ChangeDetectorRef, Component, Input } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-answers-input',
  templateUrl: './answers-input.component.html',
  styleUrls: ['./answers-input.component.scss']
})
export class AnswersInputComponent {
  constructor (private fb: FormBuilder, private cd: ChangeDetectorRef) {}
  @Input() form: FormGroup
  @Input() question: FormGroup
  @Input() questionIndex: number

  getQuestionAnswers (form) {
    return form.controls.questionAnswers.controls
  }

  addQuestionAnswer () {
    const answers = this.question.controls['questionAnswers'] as FormArray
    answers.push(
      this.fb.group({
        answerId: this.question.value.questionAnswers.length,
        answerName: [''],
        answerCorrect: [false]
      })
    )
    this.cd.detectChanges()
  }

  removeQuestionAnswer (answerIndex: number) {
    const answers = this.question.controls['questionAnswers'] as FormArray
    answers.removeAt(answerIndex)
  }
}
