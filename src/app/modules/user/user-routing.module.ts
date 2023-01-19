import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { QuizzesDefaultComponent } from './components/quizzes-default/quizzes-default.component'
import { QuizComponent } from './views/quiz/quiz.component'
import { QuizzesComponent } from './views/quizzes/quizzes.component'

const routes: Routes = [
  {
    path: '',
    component: QuizzesComponent,
    children: [
      {
        path: '',
        component: QuizzesDefaultComponent
      },
      {
        path: ':language/:level',
        component: QuizComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
