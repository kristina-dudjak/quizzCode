import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { PasswordRegex } from 'src/app/shared/const/PasswordRegex'
import { StoreService } from 'src/app/shared/services/store.service'
import { ValidationService } from 'src/app/shared/services/validation.service'
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  constructor (
    private validationService: ValidationService,
    private fb: FormBuilder,
    private authService: AuthService,
    private storeService: StoreService
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
  errorMessage$ = this.storeService.errorMessage$
  rememberMe = true

  async onRegister () {
    if (!this.registerForm.valid) {
      return
    }
    await this.authService.signUp(
      this.registerForm.value.email as string,
      this.registerForm.value.password as string,
      this.rememberMe
    )
  }

  async onGoogleLogin () {
    await this.authService.googleSignIn(this.rememberMe)
  }
}
