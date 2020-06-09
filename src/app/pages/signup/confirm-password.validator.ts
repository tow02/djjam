import { AbstractControl } from '@angular/forms';
export class ConfirmPasswordValidator {
  static MatchPassword(control: AbstractControl) {
    let password = control.get('password').value;
    let confirmPassword = control.get('confirmPassword').value;
    if (password != confirmPassword) {
        
      control.get('confirmPassword').setErrors({ ...control.get('confirmPassword').errors ,MatchPassword : true });
    }
    else {
      return null;
    }
  }
}