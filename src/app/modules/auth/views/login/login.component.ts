import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { PasswordRegex } from 'src/app/shared/const/PasswordRegex'
import { PasswordResetDialogComponent } from '../../components/password-reset-dialog/password-reset-dialog.component'
import { AuthService } from '../../services/auth.service'
import { ValidationService } from '../../services/validation.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor (
    private validationService: ValidationService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}
  errorMessage$ = this.authService.errorMessage$

  loginForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(PasswordRegex)
        ]
      ]
    },
    {
      validators: [
        this.validationService.validate('email'),
        this.validationService.validate('password')
      ],
      updateOn: 'change'
    }
  )

  isPasswordVisible = true
  rememberMe = true

  onLogin () {
    if (!this.loginForm.valid) return
    this.authService.signIn(
      this.loginForm.value.email as string,
      this.loginForm.value.password as string,
      this.rememberMe
    )
  }

  onGoogleLogin () {
    this.authService.googleSignIn(this.rememberMe)
  }

  openEmailDialog () {
    this.dialog.open(PasswordResetDialogComponent)
  }
}