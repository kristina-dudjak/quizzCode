import { Component } from '@angular/core'
import { FormArray, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.scss']
})
export class NewQuizComponent {
  constructor(private fb: FormBuilder) {}

  quizForm = this.fb.group({
    language: [''],
    thumbnail: [''],
    level: [''],
    questions: this.initQuestions()
  })

  initQuestions() {
    return this.fb.array([
      this.fb.group({
        questionName: [''],
        questionAnswers: this.initQuestionAnswers()
      })
    ])
  }

  initQuestionAnswers() {
    return this.fb.array([
      this.fb.group({
        answerName: [''],
        answerCorrect: ['']
      })
    ])
  }

  getQuestions(form) {
    // return form.controls.questions.controls
    return this.quizForm.controls.questions.controls
  }

  getQuestionAnswers(form) {
    return form.controls.questionAnswers.controls
  }

  addQuestion() {
    const control = <FormArray>(<unknown>this.quizForm.get('questions'))
    control.push(
      this.fb.group({
        questionName: [''],
        questionAnswers: this.fb.array([
          this.fb.group({
            answerName: [''],
            answerCorrect: ['']
          })
        ])
      })
    )
  }

  removeQuestion(i) {
    const control = <FormArray>this.quizForm.get('questions')
    control.removeAt(i)
  }

  addQuestionAnswer(j) {
    const questions = <FormArray>(<unknown>this.quizForm.get('questions'))
    const answers = questions.controls[j].get('questionAnswers') as FormArray
    answers.push(
      this.fb.group({
        answerName: [''],
        answerCorrect: ['']
      })
    )
  }

  removeQuestionAnswer(j) {
    const questions = this.quizForm.get('questions') as FormArray
    const answers = questions.controls[j].get('questionAnswers') as FormArray
    answers.removeAt(j)
  }

  onSubmit() {}
}
