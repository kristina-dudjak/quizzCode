import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { UserRoutingModule } from './user-routing.module'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'

import { QuizzesComponent } from './views/quizzes/quizzes.component'

import { SolvedListComponent } from './components/solved-list/solved-list.component'
import { SolvedItemComponent } from './components/solved-item/solved-item.component'
import { AllQuizzesComponent } from './components/all-quizzes/all-quizzes.component'
import { AvailableQuizComponent } from './components/available-quiz/available-quiz.component'

@NgModule({
  declarations: [
    QuizzesComponent,
    SolvedListComponent,
    SolvedItemComponent,
    AllQuizzesComponent,
    AvailableQuizComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ]
})
export class UserModule {}
