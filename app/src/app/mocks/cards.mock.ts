import { Card } from '../models/card.model';

/**
 * Acervo inicial com dados FICTÍCIOS: nomes, coleções e ilustradores
 * são inventados e as cartas são representadas por gradientes CSS.
 */
export const CARDS_MOCK: Card[] = [
  { id: 1000, nome: 'Pyrodrake Kasumi Holo', colecao: 'Origem JP', numero: '006/102', tipo: 'Fogo', raridade: 'Ultra Rara', idioma: 'Japonês', variante: 'Holo • 1ª Edição', estado: 'NM', preco: 2450, estoque: 2, ano: 1996, gradiente: 'g1', dataCadastro: '2026-08-12' },
  { id: 1001, nome: 'Marelion Neo Promo', colecao: 'Neo Aurora JP', numero: 'P-031', tipo: 'Água', raridade: 'Promo', idioma: 'Japonês', variante: 'Promo', estado: 'EX', preco: 380, estoque: 4, ano: 2000, gradiente: 'g2', dataCadastro: '2026-08-15' },
  { id: 1002, nome: 'Voltilo Tribute', colecao: 'Promo Card JP', numero: 'P-001', tipo: 'Elétrico', raridade: 'Secreta', idioma: 'Japonês', variante: 'Full Art', estado: 'M', preco: 5900, estoque: 1, ano: 1998, gradiente: 'g3', dataCadastro: '2026-08-20' },
  { id: 1003, nome: 'Brotoleaf Vending', colecao: 'Série Vending', numero: 'V-014', tipo: 'Planta', raridade: 'Comum', idioma: 'Japonês', variante: 'Normal', estado: 'NM', preco: 120, estoque: 12, ano: 1998, gradiente: 'g4', dataCadastro: '2026-08-22' },
  { id: 1004, nome: 'Psymora Gold', colecao: 'Série VS', numero: '045/141', tipo: 'Psíquico', raridade: 'Ultra Rara', idioma: 'Japonês', variante: 'Gold Star', estado: 'NM', preco: 1780, estoque: 2, ano: 2001, gradiente: 'g5', dataCadastro: '2026-09-01' },
  { id: 1005, nome: 'Lullafae Song Holo', colecao: 'Ginásio Heroico JP', numero: '054/132', tipo: 'Fada', raridade: 'Rara', idioma: 'Japonês', variante: 'Holo', estado: 'EX', preco: 260, estoque: 6, ano: 2000, gradiente: 'g6', dataCadastro: '2026-09-03' },
  { id: 1006, nome: 'Emberfox Ember', colecao: 'Origem JP', numero: '012/102', tipo: 'Fogo', raridade: 'Rara', idioma: 'Japonês', variante: 'Holo', estado: 'GD', preco: 410, estoque: 3, ano: 1996, gradiente: 'g1', dataCadastro: '2026-09-10' },
  { id: 1007, nome: 'Tidalserp Tidal', colecao: 'Eclipse Sombrio JP', numero: '008/082', tipo: 'Água', raridade: 'Ultra Rara', idioma: 'Japonês', variante: 'Holo • Sombrio', estado: 'NM', preco: 990, estoque: 2, ano: 1997, gradiente: 'g2', dataCadastro: '2026-09-14' },
  { id: 1008, nome: 'Thundrat Thunder Gold', colecao: 'Série-e JP', numero: '101/088', tipo: 'Elétrico', raridade: 'Secreta', idioma: 'Japonês', variante: 'Crystal', estado: 'M', preco: 1250, estoque: 1, ano: 2002, gradiente: 'g3', dataCadastro: '2026-09-20' },
  { id: 1009, nome: 'Florabeast Bloom', colecao: 'Origem JP', numero: '015/102', tipo: 'Planta', raridade: 'Rara', idioma: 'Japonês', variante: 'Holo', estado: 'EX', preco: 640, estoque: 3, ano: 1996, gradiente: 'g4', dataCadastro: '2026-10-02' },
  { id: 1010, nome: 'Umbrashade Shadow Holo', colecao: 'Neo Aurora JP', numero: '094/105', tipo: 'Psíquico', raridade: 'Ultra Rara', idioma: 'Japonês', variante: 'Holo • Reverse', estado: 'NM', preco: 1120, estoque: 2, ano: 2001, gradiente: 'g5', dataCadastro: '2026-10-11' },
  { id: 1011, nome: 'Lunapix Moonlight', colecao: 'Ginásio Heroico JP', numero: '088/132', tipo: 'Fada', raridade: 'Comum', idioma: 'Japonês', variante: 'Normal', estado: 'PL', preco: 90, estoque: 15, ano: 2000, gradiente: 'g6', dataCadastro: '2026-10-25' },
];
