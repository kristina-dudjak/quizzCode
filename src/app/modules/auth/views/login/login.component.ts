import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { PasswordRegex } from 'src/app/shared/const/PasswordRegex'
import { ValidationService } from '../../services/validation.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor (
    private validationService: ValidationService,
    private fb: FormBuilder
  ) {}

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
  }

  onGoogleLogin () {}

  openEmailDialog () {}
}
