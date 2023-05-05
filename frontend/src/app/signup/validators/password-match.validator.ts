import { ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  formGroup: AbstractControl
): ValidationErrors | null => {
  return formGroup.get('password1')?.value === formGroup.get('password2')?.value
    ? null
    : { passwordMismatch: true };
};
