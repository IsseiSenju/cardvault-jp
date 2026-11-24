import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Converte os erros HTTP em mensagens amigáveis em português,
 * para que os componentes só precisem exibir `erro.message`.
 */
export const erroApiInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      let mensagem: string;
      if (erro.status === 0) {
        mensagem = 'Não foi possível conectar à API. Verifique se o JSON-Server está rodando (npm run api).';
      } else if (erro.status === 404) {
        mensagem = 'Registro não encontrado na API.';
      } else {
        mensagem = `Erro ${erro.status} ao comunicar com a API.`;
      }
      return throwError(() => new Error(mensagem));
    })
  );
