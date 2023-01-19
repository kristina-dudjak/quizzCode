import { ChangeDetectorRef, Component, Input } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-answers-input',
  templateUrl: './answers-input.component.html',
  styleUrls: ['./answers-input.component.scss']
})
export class AnswersInputComponent {
  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}
  @Input() form: FormGroup
  @Input() question: FormGroup
  @Input() i: number

  getQuestionAnswers(form) {
    return form.controls.questionAnswers.controls
  }

  addQuestionAnswer(j: number) {
    const questions = <FormArray>this.form.get('questions')
    const answers = questions.controls[j].get('questionAnswers') as FormArray
    answers.push(
      this.fb.group({
        answerName: [''],
        answerCorrect: [false]
      })
    )
    this.cd.detectChanges()
  }

  removeQuestionAnswer(j: number) {
    const questions = this.form.get('questions') as FormArray
    const answers = questions.controls[j].get('questionAnswers') as FormArray
    answers.removeAt(j)
  }
}
