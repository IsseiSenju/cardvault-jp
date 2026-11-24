import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, map, of, switchMap, timer } from 'rxjs';

/** E-mail com domínio contendo ponto (o Validators.email aceita "a@b"). */
export const PADRAO_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Número da carta: 006/102, P-031, V-014... */
export const PADRAO_NUMERO_CARTA = /^([A-Z]{1,2}-)?\d{3}(\/\d{3})?$/;

/** Reprova textos formados só por espaços. */
export function naoVazio(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    return typeof valor === 'string' && valor.length > 0 && !valor.trim() ? { vazio: true } : null;
  };
}

/** Validador de grupo: os dois campos informados precisam ser iguais. */
export function camposIguais(campo: string, confirmacao: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(campo)?.value;
    const b = grupo.get(confirmacao)?.value;
    return a && b && a !== b ? { camposDiferentes: true } : null;
  };
}

/**
 * Validador assíncrono: consulta a API e marca { emailEmUso } se o
 * e-mail já estiver cadastrado. O timer evita uma requisição por tecla.
 */
export function emailUnico(verificar: (email: string) => Observable<boolean>): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || !PADRAO_EMAIL.test(control.value)) return of(null);
    return timer(400).pipe(
      switchMap(() => verificar(control.value)),
      map(disponivel => (disponivel ? null : { emailEmUso: true }))
    );
  };
}
