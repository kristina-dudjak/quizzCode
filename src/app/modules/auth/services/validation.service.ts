import { Injectable } from '@angular/core'
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'
import { ValidationMessages } from 'src/app/shared/const/ValidationMessages'

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  validate (controlName: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      const form = control.get(controlName)
      if (!form?.errors) return null
      const [error] = Object.keys(form.errors)
      return { [controlName]: ValidationMessages[error] }
    }
  }

  validatePasswordMatch (controlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const form = control.get(controlName)
      if (form.value === control.get('password').value) {
        return null
      }
      form?.setErrors({ [controlName]: true })
      return { [controlName]: ValidationMessages['mismatch'] }
    }
  }
}
