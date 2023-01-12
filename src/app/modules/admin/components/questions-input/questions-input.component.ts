import { Component, Input } from '@angular/core'
import { FormArray, FormGroup } from '@angular/forms'
import { Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-questions-input',
  templateUrl: './questions-input.component.html',
  styleUrls: ['./questions-input.component.scss']
})
export class QuestionsInputComponent {
  constructor() {}

  @Input() form: FormGroup
  @Output() newEvent = new EventEmitter()

  getQuestions(form) {
    return form.controls.questions.controls
  }

  addQuestion() {
    this.newEvent.emit()
  }

  removeQuestion(i: number) {
    const control = <FormArray>this.form.get('questions')
    control.removeAt(i)
  }
}
