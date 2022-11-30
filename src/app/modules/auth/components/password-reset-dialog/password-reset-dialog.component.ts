import { Component } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { ValidationService } from '../../services/validation.service'

@Component({
  selector: 'app-password-reset-dialog',
  templateUrl: './password-reset-dialog.component.html',
  styleUrls: ['./password-reset-dialog.component.scss']
})
export class PasswordResetDialogComponent {
  constructor (
    private validationService: ValidationService,
    private fb: FormBuilder
  ) {}

  emailForm = this.fb.group(
    {
      emailReset: ['', [Validators.required, Validators.email]]
    },
    {
      validators: [this.validationService.validate('emailReset')],
      updateOn: 'change'
    }
  )

  sendEmail () {
    if (!this.emailForm.valid) return
  }
}
