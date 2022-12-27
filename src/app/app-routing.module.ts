import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import {
  redirectLoggedInTo,
  redirectUnauthorizedTo,
  canActivate
} from '@angular/fire/compat/auth-guard'
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component'

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login'])

const redirectLoggedInToConfigurator = () => redirectLoggedInTo(['quizzes'])

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule),
    ...canActivate(redirectLoggedInToConfigurator)
  },
  {
    path: 'quizzes',
    loadChildren: () =>
      import('./modules/user/user.module').then(m => m.UserModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
