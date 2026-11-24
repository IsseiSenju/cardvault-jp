import { Injectable, computed, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../api.config';
import { Perfil, Usuario, UsuarioSessao } from '../models/usuario.model';

const CHAVE_SESSAO = 'cardvault.usuario';

/**
 * Autenticação usando a coleção /usuarios do JSON-Server.
 * O usuário logado fica em um signal (a navbar e os guards reagem a ele)
 * e é salvo no localStorage ("lembrar de mim") ou no sessionStorage.
 *
 * Observação: é uma autenticação didática — em produção a senha seria
 * validada no servidor (hash + token JWT), nunca no front-end.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly url = `${API_URL}/usuarios`;
  private readonly usuarioAtual = signal<UsuarioSessao | null>(this.restaurarSessao());

  readonly usuario = this.usuarioAtual.asReadonly();
  readonly estaLogado = computed(() => this.usuarioAtual() !== null);
  readonly isAdmin = computed(() => this.usuarioAtual()?.perfil === 'admin');

  constructor(private http: HttpClient) {}

  /** Emite o usuário autenticado ou null se e-mail, senha ou perfil não conferirem. */
  login(email: string, senha: string, perfil: Perfil, lembrar = false): Observable<UsuarioSessao | null> {
    const params = new HttpParams().set('email', this.normalizar(email)).set('perfil', perfil);
    return this.http.get<Usuario[]>(this.url, { params }).pipe(
      map(usuarios => {
        const usuario = usuarios.find(u => u.senha === senha);
        if (!usuario) return null;
        const { senha: _, ...sessao } = usuario;
        this.salvarSessao(sessao, lembrar);
        return sessao;
      })
    );
  }

  /** Cadastra um novo cliente (POST /usuarios). */
  registrar(nome: string, email: string, senha: string): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, {
      nome: nome.trim(),
      email: this.normalizar(email),
      senha,
      perfil: 'cliente'
    });
  }

  /** Usado pelo validador assíncrono do cadastro. */
  emailDisponivel(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', this.normalizar(email));
    return this.http.get<Usuario[]>(this.url, { params }).pipe(map(lista => lista.length === 0));
  }

  logout(): void {
    this.usuarioAtual.set(null);
    this.armazenar(() => {
      localStorage.removeItem(CHAVE_SESSAO);
      sessionStorage.removeItem(CHAVE_SESSAO);
    });
  }

  private salvarSessao(usuario: UsuarioSessao, lembrar: boolean): void {
    this.usuarioAtual.set(usuario);
    this.armazenar(() => (lembrar ? localStorage : sessionStorage).setItem(CHAVE_SESSAO, JSON.stringify(usuario)));
  }

  private restaurarSessao(): UsuarioSessao | null {
    try {
      const salvo = localStorage.getItem(CHAVE_SESSAO) ?? sessionStorage.getItem(CHAVE_SESSAO);
      return salvo ? JSON.parse(salvo) : null;
    } catch {
      return null;
    }
  }

  /** O armazenamento pode estar bloqueado (aba anônima); a sessão continua em memória. */
  private armazenar(acao: () => void): void {
    try { acao(); } catch { /* ignora */ }
  }

  private normalizar(email: string): string {
    return email.trim().toLowerCase();
  }
}
