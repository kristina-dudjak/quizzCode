import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { UserRoutingModule } from './user-routing.module'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'

import { QuizzesComponent } from './views/quizzes/quizzes.component'

import { SolvedListComponent } from './components/solved-list/solved-list.component'
import { SolvedItemComponent } from './components/solved-item/solved-item.component'

@NgModule({
  declarations: [QuizzesComponent, SolvedListComponent, SolvedItemComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule
  ]
})
export class UserModule {}
