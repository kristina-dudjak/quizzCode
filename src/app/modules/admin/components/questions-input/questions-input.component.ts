import { Component, Input, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Question } from 'src/app/shared/models/Question'
import { ValidationService } from 'src/app/shared/services/validation.service'

@Component({
  selector: 'app-questions-input',
  templateUrl: './questions-input.component.html',
  styleUrls: ['./questions-input.component.scss']
})
export class QuestionsInputComponent implements OnInit {
  constructor (
    private fb: FormBuilder,
    private validationService: ValidationService
  ) {}

  @Input() form: FormGroup
  @Input() level: FormGroup
  @Input() questions: Question[]

  initQuestionAnswers () {
    return this.fb.array(
      [
        this.fb.group({
          answerId: [0],
          answerName: [''],
          answerCorrect: [false]
        }),
        this.fb.group({
          answerId: [1],
          answerName: [''],
          answerCorrect: [false]
        })
      ],
      {
        validators: this.validationService.minOneCorrectAnswer
      }
    )
  }

  ngOnInit () {
    if (this.questions.length !== 0 && this.form.value.language !== '') {
      const questionsForm = this.level.controls['questions'] as FormArray
      questionsForm.clear()
      this.questions.forEach(question => {
        questionsForm.push(
          this.fb.group({
            questionId: question.id,
            questionName: question.name,
            questionAnswers: this.initQuestionAnswers()
          })
        )
        const ans = questionsForm.controls[question.id].get(
          'questionAnswers'
        ) as FormArray
        ans.clear()
        question.answers.forEach(answer => {
          ans.push(
            this.fb.group({
              answerId: answer.id,
              answerName: answer.name,
              answerCorrect: answer.correct
            })
          )
        })
      })
    }
  }
  getQuestions (level) {
    return level.controls.questions.controls
  }

  addQuestion () {
    const a = this.level.controls['questions'] as FormArray
    a.push(
      this.fb.group({
        questionId: this.level.value.questions.length,
        questionName: '',
        questionAnswers: this.initQuestionAnswers()
      })
    )
  }

  removeQuestion (i: number) {
    const a = this.level.controls['questions'] as FormArray
    a.removeAt(i)
  }
}
