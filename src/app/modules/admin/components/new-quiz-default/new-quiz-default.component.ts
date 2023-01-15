import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormArray } from '@angular/forms'
import { Router } from '@angular/router'
import { Answer } from 'src/app/shared/models/Answer'
import { Question } from 'src/app/shared/models/Question'
import { AttemptedQuiz, Quiz } from 'src/app/shared/models/Quiz'
import { AdminService } from '../../services/admin.service'

@Component({
  selector: 'app-new-quiz-default',
  templateUrl: './new-quiz-default.component.html',
  styleUrls: ['./new-quiz-default.component.scss']
})
export class NewQuizDefaultComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {}
  @Input() questions: Question[]
  @Input() attemptedQuiz: AttemptedQuiz
  quizForm = this.fb.group({
    language: [''],
    thumbnail: [''],
    level: [''],
    questions: this.initQuestions()
  })

  ngOnInit(): void {
    if (this.attemptedQuiz) {
      this.quizForm.controls['language'].setValue(this.attemptedQuiz.name)
      this.quizForm.controls['thumbnail'].setValue(this.attemptedQuiz.thumbnail)
      this.quizForm.controls['level'].setValue(this.attemptedQuiz.level)
      const control = <FormArray>this.quizForm.get('questions')
      control.removeAt(0)
      this.questions.forEach(question => {
        const answers: Answer[] = []
        question.answers.forEach(answer => {
          answers.push(answer)
        })
        control.push(
          this.fb.group({
            questionId: question.id,
            questionName: question.name,
            questionAnswers: this.initQuestionAnswers()
          })
        )
        const ans = control.controls[question.id].get(
          'questionAnswers'
        ) as FormArray
        ans.removeAt(0)
        answers.forEach(answer => {
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

  initQuestions() {
    return this.fb.array([
      this.fb.group({
        questionId: [''],
        questionName: [''],
        questionAnswers: this.initQuestionAnswers()
      })
    ])
  }

  initQuestionAnswers() {
    return this.fb.array([
      this.fb.group({
        answerId: [''],
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

  async deleteQuiz(attemptedQuiz: Quiz, questions: Question[]) {
    await this.adminService.deleteAttemptedQuiz(attemptedQuiz, questions)
    this.router.navigateByUrl('quizzes')
  }

  async onSubmit() {
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
        id: this.quizForm.value.questions.indexOf(question)
      })
    })
    const quiz: Quiz = {
      thumbnail: thumbnail,
      name: language,
      level: level,
      questions: quest
    }
    await this.adminService.saveNewQuizToDb(
      quiz,
      this.attemptedQuiz,
      this.questions
    )
    this.router.navigateByUrl('quizzes')
  }
}
