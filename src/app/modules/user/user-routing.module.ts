import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { QuizzesComponent } from './components/quizzes/quizzes.component'

const routes: Routes = [
  {
    path: '',
    component: QuizzesComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}