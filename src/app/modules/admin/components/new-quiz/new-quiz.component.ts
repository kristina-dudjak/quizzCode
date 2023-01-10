import { Component } from '@angular/core'
import { FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.scss']
})
export class NewQuizComponent {
  constructor (private fb: FormBuilder) {}

  quizForm = this.fb.group({
    language: [''],
    thumbnail: [''],
    level: [''],
    questions: this.initQuestions()
  })

  initQuestions () {
    return this.fb.array([
      this.fb.group({
        questionName: [''],
        questionAnswers: this.initQuestionAnswers()
      })
    ])
  }

  initQuestionAnswers () {
    return this.fb.array([
      this.fb.group({
        answerName: [''],
        answerCorrect: ['']
      })
    ])
  }

  getStuff () {
    console.log(this.quizForm.value)
  }

  onSubmit () {}
}
