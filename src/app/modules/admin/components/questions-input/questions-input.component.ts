import { Component, Input } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-questions-input',
  templateUrl: './questions-input.component.html',
  styleUrls: ['./questions-input.component.scss']
})
export class QuestionsInputComponent {
  constructor(private fb: FormBuilder) {}

  @Input() form: FormGroup
  @Input() initQuestionAnswers: () => void

  getQuestions(form) {
    return form.controls.questions.controls
  }

  addQuestion() {
    const control = <FormArray>this.form.get('questions')
    control.push(
      this.fb.group({
        questionName: [''],
        questionAnswers: this.initQuestionAnswers()
      })
    )
  }

  removeQuestion(i: number) {
    const control = <FormArray>this.form.get('questions')
    control.removeAt(i)
  }
}
