/** Mensagem enviada pelo formulário "Fale conosco" da página Sobre. */
export interface Mensagem {
  id?: number;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  data: string;
}
