export type Perfil = 'cliente' | 'admin';

export interface Usuario {
  nome: string;
  email: string;
  senha: string;
  perfil: Perfil;
}
