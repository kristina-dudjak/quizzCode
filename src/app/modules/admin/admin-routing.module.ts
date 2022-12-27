import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { BlaComponent } from './components/bla/bla.component'

const routes: Routes = [
  {
    path: 'admin',
    component: BlaComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
