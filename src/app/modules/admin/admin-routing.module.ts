import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NewQuizComponent } from './components/new-quiz/new-quiz.component'
import { AdminComponent } from './views/admin/admin.component'

const routes: Routes = [
  {
    path: '',
    component: AdminComponent
  },
  {
    path: 'new-quiz',
    component: NewQuizComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
