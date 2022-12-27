import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { QuizzesComponent } from './components/quizzes/quizzes.component';


@NgModule({
  declarations: [
    QuizzesComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
