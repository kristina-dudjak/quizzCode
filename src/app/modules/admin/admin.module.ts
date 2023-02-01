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
import { MatTabsModule } from '@angular/material/tabs'
import { MatDialogModule } from '@angular/material/dialog'

import { AdminComponent } from './views/admin/admin.component'
import { QuestionsInputComponent } from './components/questions-input/questions-input.component'
import { AnswersInputComponent } from './components/answers-input/answers-input.component'
import { NewQuizDefaultComponent } from './components/new-quiz-default/new-quiz-default.component'
import { DeleteLevelDialogComponent } from './components/delete-level-dialog/delete-level-dialog.component'
import { DeleteQuizDialogComponent } from './components/delete-quiz-dialog/delete-quiz-dialog.component'
import { LevelItemComponent } from './components/level-item/level-item.component'

@NgModule({
  declarations: [
    AdminComponent,
    QuestionsInputComponent,
    AnswersInputComponent,
    NewQuizDefaultComponent,
    DeleteLevelDialogComponent,
    DeleteQuizDialogComponent,
    LevelItemComponent
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
    MatCheckboxModule,
    MatTabsModule,
    MatDialogModule
  ]
})
export class AdminModule {}
