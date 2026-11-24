import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Protege a área administrativa (rota /admin, carregada por lazy loading).
 * Por ser um canMatch, o código do AdminModule só é baixado quando o
 * usuário é administrador.
 *  - não logado  → /login?retorno=/admin/...
 *  - cliente     → /catalogo
 */
export const adminGuard: CanMatchFn = (_route, segments: UrlSegment[]) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) {
    return true;
  }
  if (!auth.estaLogado()) {
    const retorno = '/' + segments.map(s => s.path).join('/');
    return router.createUrlTree(['/login'], { queryParams: { retorno } });
  }
  return router.createUrlTree(['/catalogo']);
};
