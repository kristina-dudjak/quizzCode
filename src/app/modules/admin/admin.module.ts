import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AdminRoutingModule } from './admin-routing.module'
import { MatInputModule } from '@angular/material/input'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AdminComponent } from './views/admin/admin.component'
import { AdminDefaultComponent } from './components/admin-default/admin-default.component'
import { NewQuizComponent } from './components/new-quiz/new-quiz.component'

@NgModule({
  declarations: [AdminComponent, AdminDefaultComponent, NewQuizComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule {}
