import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validator de password: debe contener al menos 6 caracteres, una mayúscula, una minúscula y un número
 * @returns 
 */
export function customPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;  // Return null for empty values
    }

    const hasUpperCase = /[A-Z]/.test(control.value);
    const hasLowerCase = /[a-z]/.test(control.value);
    const hasNumber = /[0-9]/.test(control.value);
    const hasMinLength = control.value.length >= 6;

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasMinLength) {
      return {
        customPassword: 'El password debe contener al menos 6 caracteres, una mayúscula, una minúscula y un número.'
      };
    }

    return null;  // Password is valid
  };
}
