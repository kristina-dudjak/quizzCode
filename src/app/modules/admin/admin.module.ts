import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AdminRoutingModule } from './admin-routing.module'
import { MatInputModule } from '@angular/material/input'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AdminComponent } from './views/admin/admin.component'
import { AdminDefaultComponent } from './components/admin-default/admin-default.component'
import { NewQuizComponent } from './components/new-quiz/new-quiz.component'
import { QuestionsInputComponent } from './components/questions-input/questions-input.component'
import { AnswersInputComponent } from './components/answers-input/answers-input.component'

@NgModule({
  declarations: [
    AdminComponent,
    AdminDefaultComponent,
    NewQuizComponent,
    QuestionsInputComponent,
    AnswersInputComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule {}
