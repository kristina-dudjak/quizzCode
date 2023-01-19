import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { UserRoutingModule } from './user-routing.module'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { MatDialogModule } from '@angular/material/dialog'
import { MatDividerModule } from '@angular/material/divider'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatRadioModule } from '@angular/material/radio'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatProgressBarModule } from '@angular/material/progress-bar'

import { QuizzesComponent } from './views/quizzes/quizzes.component'

import { SolvedListComponent } from './components/solved-list/solved-list.component'
import { SolvedItemComponent } from './components/solved-item/solved-item.component'
import { AllQuizzesComponent } from './components/all-quizzes/all-quizzes.component'
import { AvailableQuizComponent } from './components/available-quiz/available-quiz.component'
import { QuizLevelDialogComponent } from './components/quiz-level-dialog/quiz-level-dialog.component'
import { QuizComponent } from './views/quiz/quiz.component'
import { QuizzesDefaultComponent } from './components/quizzes-default/quizzes-default.component'
import { ConfirmSubmitDialogComponent } from './components/confirm-submit-dialog/confirm-submit-dialog.component'
import { QuizResultDialogComponent } from './components/quiz-result-dialog/quiz-result-dialog.component'
import { QuizDefaultComponent } from './components/quiz-default/quiz-default.component'
import { SolvedQuizzesPipe } from './pipes/solved-quizzes.pipe'
import { QuizFormComponent } from './components/quiz-form/quiz-form.component'

@NgModule({
  declarations: [
    QuizzesComponent,
    SolvedListComponent,
    SolvedItemComponent,
    AllQuizzesComponent,
    AvailableQuizComponent,
    QuizLevelDialogComponent,
    QuizComponent,
    QuizzesDefaultComponent,
    ConfirmSubmitDialogComponent,
    QuizResultDialogComponent,
    QuizDefaultComponent,
    SolvedQuizzesPipe,
    QuizFormComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatButtonToggleModule,
    MatProgressBarModule
  ]
})
export class UserModule {}
