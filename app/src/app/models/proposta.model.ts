export type StatusProposta = 'pendente' | 'aceita' | 'recusada';

/** Proposta de negociação enviada pela página de detalhe de um card. */
export interface Proposta {
  id?: number;
  cardId: number;
  cardNome: string;
  nome: string;
  email: string;
  valorOferecido: number;
  mensagem: string;
  status: StatusProposta;
  data: string;
}
