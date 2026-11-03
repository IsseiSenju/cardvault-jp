import { Injectable } from '@angular/core';
import { Perfil, Usuario } from '../models/usuario.model';

/** Usuários de teste (mock). Serão migrados para o JSON-Server. */
const USUARIOS_MOCK: Usuario[] = [
  { nome: 'Kaique (cliente)', email: 'cliente@cardvault.jp', senha: 'cliente123', perfil: 'cliente' },
  { nome: 'Kaique (admin)', email: 'admin@cardvault.jp', senha: 'admin1234', perfil: 'admin' },
];

/**
 * Autenticação simples em memória. Na próxima etapa servirá de base
 * para os Route Guards da área administrativa.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usuarioAtual: Usuario | null = null;

  /** Retorna true se e-mail, senha e perfil conferem com um usuário mock. */
  login(email: string, senha: string, perfil: Perfil): boolean {
    const usuario = USUARIOS_MOCK.find(u =>
      u.email === email.trim().toLowerCase() && u.senha === senha && u.perfil === perfil
    );
    this.usuarioAtual = usuario ? { ...usuario } : null;
    return !!usuario;
  }

  /** Cadastra um novo cliente na sessão. Retorna false se o e-mail já existir. */
  registrar(nome: string, email: string, senha: string): boolean {
    const emailNormalizado = email.trim().toLowerCase();
    if (USUARIOS_MOCK.some(u => u.email === emailNormalizado)) {
      return false;
    }
    USUARIOS_MOCK.push({ nome: nome.trim(), email: emailNormalizado, senha, perfil: 'cliente' });
    return true;
  }

  logout(): void {
    this.usuarioAtual = null;
  }

  get usuario(): Usuario | null {
    return this.usuarioAtual;
  }

  estaLogado(): boolean {
    return this.usuarioAtual !== null;
  }

  isAdmin(): boolean {
    return this.usuarioAtual?.perfil === 'admin';
  }
}
