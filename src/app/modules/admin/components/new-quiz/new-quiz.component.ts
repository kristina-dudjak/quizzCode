import { Component } from '@angular/core'
import { FormArray, FormBuilder } from '@angular/forms'
import { Answer } from 'src/app/shared/models/Answer'
import { Question } from 'src/app/shared/models/Question'
import { Quiz } from 'src/app/shared/models/Quiz'
import { AdminService } from '../../services/admin.service'

@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.scss']
})
export class NewQuizComponent {
  constructor(private fb: FormBuilder, private adminService: AdminService) {}

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
        answerCorrect: [false]
      })
    ])
  }

  addQuestion() {
    const control = <FormArray>this.quizForm.get('questions')
    control.push(
      this.fb.group({
        questionName: [''],
        questionAnswers: this.initQuestionAnswers()
      })
    )
  }

  onSubmit() {
    const { thumbnail, language, level, questions } = this.quizForm.value
    const quest: Question[] = []
    questions.forEach(question => {
      const answers: Answer[] = []
      question.questionAnswers.forEach(answer => {
        answers.push({
          name: answer.answerName,
          correct: answer.answerCorrect,
          id: question.questionAnswers.indexOf(answer).toString()
        })
      })
      quest.push({
        name: question.questionName,
        answers: answers,
        id: this.quizForm.value.questions.indexOf(question).toString()
      })
    })
    const quiz: Quiz = {
      thumbnail: thumbnail,
      name: language,
      level: level,
      questions: quest
    }
    this.adminService.saveNewQuizToDb(quiz)
  }
}
