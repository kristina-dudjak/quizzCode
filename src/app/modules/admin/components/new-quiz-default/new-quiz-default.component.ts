import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormArray } from '@angular/forms'
import { Router } from '@angular/router'
import { Question } from 'src/app/shared/models/Question'
import { AttemptedQuiz, Quiz } from 'src/app/shared/models/Quiz'
import { User } from 'src/app/shared/models/User'
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
  @Input() user: User
  quizForm = this.fb.group({
    language: [''],
    thumbnail: [''],
    level: [''],
    questions: this.initQuestions()
  })

  ngOnInit() {
    if (!this.user.isAdmin) this.router.navigateByUrl('quizzes')
    if (this.attemptedQuiz) {
      this.quizForm.patchValue({
        language: this.attemptedQuiz.name,
        thumbnail: this.attemptedQuiz.thumbnail,
        level: this.attemptedQuiz.level
      })
      const control = this.quizForm.get('questions') as FormArray
      control.clear()
      this.questions.forEach(question => {
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

  resetQuiz() {
    this.quizForm.reset()
  }

  async deleteQuiz(attemptedQuiz: Quiz, questions: Question[]) {
    await this.adminService.deleteAttemptedQuiz(attemptedQuiz, questions)
    this.router.navigateByUrl('quizzes')
  }

  async onSubmit() {
    const { thumbnail, language, level, questions } = this.quizForm.value
    const quests = questions.map((question, id) => {
      const answers = question.questionAnswers.map((answer, answerIndex) => {
        return {
          name: answer.answerName,
          correct: answer.answerCorrect,
          id: answerIndex.toString()
        }
      })
      return { name: question.questionName, answers, id }
    })
    const quiz: Quiz = {
      thumbnail,
      name: language,
      level,
      questions: quests
    }
    await this.adminService.saveNewQuizToDb(
      quiz,
      this.attemptedQuiz,
      this.questions
    )
    this.router.navigateByUrl('quizzes')
  }
}
