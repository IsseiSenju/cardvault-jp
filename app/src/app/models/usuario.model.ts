export type Perfil = 'cliente' | 'admin';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
}

/** Dados do usuário mantidos na sessão (nunca guardamos a senha). */
export type UsuarioSessao = Omit<Usuario, 'senha'>;
