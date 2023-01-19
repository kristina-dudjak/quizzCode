import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AdminRoutingModule } from './admin-routing.module'
import { MatInputModule } from '@angular/material/input'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatDividerModule } from '@angular/material/divider'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatCardModule } from '@angular/material/card'

import { AdminComponent } from './views/admin/admin.component'
import { QuestionsInputComponent } from './components/questions-input/questions-input.component'
import { AnswersInputComponent } from './components/answers-input/answers-input.component'
import { NewQuizDefaultComponent } from './components/new-quiz-default/new-quiz-default.component'

@NgModule({
  declarations: [
    AdminComponent,
    QuestionsInputComponent,
    AnswersInputComponent,
    NewQuizDefaultComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule
  ]
})
export class AdminModule {}
