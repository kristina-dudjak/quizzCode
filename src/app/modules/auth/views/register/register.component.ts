import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { PasswordRegex } from 'src/app/shared/const/PasswordRegex'
import { ValidationService } from '../../services/validation.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor (
    private validationService: ValidationService,
    private fb: FormBuilder
  ) {}

  registerForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(PasswordRegex)
        ]
      ],
      repeatPassword: [
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
        this.validationService.validate('password'),
        this.validationService.validate('repeatPassword'),
        this.validationService.validatePasswordMatch('repeatPassword')
      ],
      updateOn: 'change'
    }
  )

  isPasswordVisible = true
  isPasswordRepeatVisible = true
  rememberMe = true

  onRegister () {
    if (!this.registerForm.valid) {
      return
    }
  }

  onGoogleLogin () {}
}
