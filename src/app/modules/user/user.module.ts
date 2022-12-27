import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { UserRoutingModule } from './user-routing.module'
import { MatIconModule } from '@angular/material/icon'
import { QuizzesComponent } from './components/quizzes/quizzes.component'

@NgModule({
  declarations: [QuizzesComponent],
  imports: [CommonModule, UserRoutingModule, MatIconModule]
})
export class UserModule {}
