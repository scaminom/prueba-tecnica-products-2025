import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import type { FormErrorMapper } from '../interfaces/form-error.interface';

@Injectable({
  providedIn: 'root',
})
export class FormErrorService {
  private errorMappers: FormErrorMapper = {
    required: (_, label) => `${label} es requerido`,
    minlength: (error, label) => `${label} debe tener al menos ${error.requiredLength} caracteres`,
    maxlength: (error, label) => `${label} debe tener máximo ${error.requiredLength} caracteres`,
    dateInvalid: (_, label) => 'La fecha debe ser igual o mayor a la fecha actual',
    idExists: (_, label) => 'Este producto ID ya se encuentra registrado',
    pattern: (_, label) => `${label} no es válido`,
    revisionMismatch: (_, label) =>
      'La fecha de revisión debe ser exactamente un año después de la fecha de lanzamiento',
  };

  getErrorMessage(errors: ValidationErrors, fieldLabel: string): string {
    const errorKey = Object.keys(errors)[0];
    const mapper = this.errorMappers[errorKey];
    return mapper ? mapper(errors[errorKey], fieldLabel) : 'Campo inválido';
  }

  registerErrorMapper(errorType: string, mapper: (error: any, label: string) => string): void {
    this.errorMappers[errorType] = mapper;
  }

  registerErrorMappers(mappers: FormErrorMapper): void {
    this.errorMappers = { ...this.errorMappers, ...mappers };
  }
}
