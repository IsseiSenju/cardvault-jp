export type Raridade = 'Comum' | 'Rara' | 'Ultra Rara' | 'Secreta' | 'Promo';

export type Tipo = 'Fogo' | 'Água' | 'Planta' | 'Elétrico' | 'Psíquico' | 'Fada';

/** Estado de conservação (padrão de grading de TCG). */
export type Estado = 'M' | 'NM' | 'EX' | 'GD' | 'PL';

/** Classes CSS de gradiente usadas no lugar de imagens (g1..g6). */
export type Gradiente = 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6';

export interface Card {
  id: number;
  nome: string;
  colecao: string;
  numero: string;
  tipo: Tipo;
  raridade: Raridade;
  idioma: string;
  variante: string;
  estado: Estado;
  preco: number;
  estoque: number;
  ano: number;
  gradiente: Gradiente;
  dataCadastro: string;
}

/** Filtros aceitos pela pesquisa do catálogo (vazio = todos). */
export interface FiltrosCard {
  raridade: Raridade | '';
  tipo: Tipo | '';
  colecao: string;
}

/** Item genérico de contagem usado pelo dashboard. */
export interface Contagem {
  chave: string;
  quantidade: number;
}
