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

import { QuizzesComponent } from './views/quizzes/quizzes.component'

import { SolvedListComponent } from './components/solved-list/solved-list.component'
import { SolvedItemComponent } from './components/solved-item/solved-item.component'
import { AllQuizzesComponent } from './components/all-quizzes/all-quizzes.component'
import { AvailableQuizComponent } from './components/available-quiz/available-quiz.component'
import { QuizLevelDialogComponent } from './components/quiz-level-dialog/quiz-level-dialog.component'
import { QuizComponent } from './views/quiz/quiz.component'
import { QuizzesDefaultComponent } from './components/quizzes-default/quizzes-default.component'

@NgModule({
  declarations: [
    QuizzesComponent,
    SolvedListComponent,
    SolvedItemComponent,
    AllQuizzesComponent,
    AvailableQuizComponent,
    QuizLevelDialogComponent,
    QuizComponent,
    QuizzesDefaultComponent
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
    ReactiveFormsModule
  ]
})
export class UserModule {}
