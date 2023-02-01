import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormArray, FormControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { AttemptedQuiz } from 'src/app/shared/models/Quiz'
import { User } from 'src/app/shared/models/User'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { AdminService } from '../../services/admin.service'
import { DeleteLevelDialogComponent } from '../delete-level-dialog/delete-level-dialog.component'
import { DeleteQuizDialogComponent } from '../delete-quiz-dialog/delete-quiz-dialog.component'

@Component({
  selector: 'app-new-quiz-default',
  templateUrl: './new-quiz-default.component.html',
  styleUrls: ['./new-quiz-default.component.scss']
})
export class NewQuizDefaultComponent implements OnInit {
  constructor (
    private fb: FormBuilder,
    private validationService: ValidationService,
    private router: Router,
    private dialog: MatDialog,
    private adminService: AdminService
  ) {}
  @Input() attemptedQuiz: AttemptedQuiz
  @Input() user: User
  @Input() levels: string[]
  quizForm = this.fb.group({
    language: [''],
    thumbnail: [''],
    levels: this.fb.array([
      this.fb.group({
        levelId: [''],
        levelName: [''],
        questions: this.initQuestions()
      })
    ])
  })

  initQuestions () {
    return this.fb.array([
      this.fb.group({
        questionId: [0],
        questionName: [''],
        questionAnswers: this.initQuestionAnswers()
      })
    ])
  }

  initQuestionAnswers () {
    return this.fb.array([this.createAnswer(0), this.createAnswer(1)], {
      validators: this.validationService.minOneCorrectAnswer
    })
  }

  createAnswer (index: number) {
    return this.fb.group({
      answerId: [index],
      answerName: [''],
      answerCorrect: [false]
    })
  }

  tabs = ['Easy', 'Medium', 'Hard']
  selected = new FormControl(0)

  ngOnInit () {
    const levels = this.quizForm.get('levels') as FormArray
    levels.clear()
    this.tabs.forEach(tab => {
      levels.push(
        this.fb.group({
          levelId: this.tabs.indexOf(tab),
          levelName: tab,
          questions: this.initQuestions()
        })
      )
    })
    if (!this.user.isAdmin) this.router.navigateByUrl('quizzes')
    if (this.levels && this.attemptedQuiz && this.attemptedQuiz.name !== '') {
      this.tabs = []
      this.quizForm.patchValue({
        language: this.attemptedQuiz.name,
        thumbnail: this.attemptedQuiz.thumbnail
      })
      const levels = this.quizForm.get('levels') as FormArray
      levels.clear()
      this.levels.forEach(level => {
        this.tabs.push(level)

        levels.push(
          this.fb.group({
            levelId: this.tabs.indexOf(level),
            levelName: level,
            questions: this.initQuestions()
          })
        )
      })
    }
  }

  async delete () {
    await this.adminService.deleteQuiz(
      this.quizForm.value,
      this.attemptedQuiz.name
    )
    this.router.navigateByUrl('quizzes')
  }

  async deleteQuiz () {
    this.dialog.open(DeleteQuizDialogComponent, {
      data: {
        submitFunction: await this.delete.bind(this)
      }
    })
  }

  async deleteLevel (index: number) {
    this.dialog.open(DeleteLevelDialogComponent, {
      data: {
        submitFunction: await this.removeTab.bind(this, index)
      }
    })
  }

  async onSubmit () {
    let name = ''
    if (this.attemptedQuiz && this.attemptedQuiz.name !== '') {
      name = this.attemptedQuiz.name
    }
    await this.adminService.saveQuiz(this.quizForm.value, name)
    this.router.navigateByUrl('quizzes')
  }

  addTab () {
    this.tabs.push('New')
    this.selected.setValue(this.tabs.length - 1)
    const levels = this.quizForm.get('levels') as FormArray
    levels.push(
      this.fb.group({
        levelId: this.tabs.indexOf('New'),
        levelName: 'New',
        questions: this.initQuestions()
      })
    )
  }

  async removeTab (index: number) {
    if (this.attemptedQuiz && this.attemptedQuiz.name !== '') {
      await this.adminService.deleteQuizLevel(this.quizForm.value, index)
    }
    this.tabs.splice(index, 1)
    this.selected.setValue(this.tabs.length - 1)
    const levels = this.quizForm.get('levels') as FormArray
    levels.removeAt(index)
  }
}
