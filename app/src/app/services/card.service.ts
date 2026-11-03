import { Injectable } from '@angular/core';
import { Card, Contagem, FiltrosCard, Raridade, Tipo } from '../models/card.model';
import { CARDS_MOCK } from '../mocks/cards.mock';

/**
 * Centraliza toda a regra de negócio dos cards. Os componentes nunca
 * acessam o array diretamente: sempre recebem cópias pelos métodos abaixo.
 * Nesta versão os dados ficam em memória (duram a sessão); na próxima etapa
 * o array será substituído por chamadas HTTP ao JSON-Server.
 */
@Injectable({
  providedIn: 'root'
})
export class CardService {

  private cards: Card[] = CARDS_MOCK.map(c => ({ ...c }));

  readonly raridades: Raridade[] = ['Comum', 'Rara', 'Ultra Rara', 'Secreta', 'Promo'];
  readonly tipos: Tipo[] = ['Fogo', 'Água', 'Planta', 'Elétrico', 'Psíquico', 'Fada'];

  // ---------- Consulta ----------

  listar(): Card[] {
    return this.cards.map(c => ({ ...c }));
  }

  buscarPorId(id: number): Card | undefined {
    const card = this.cards.find(c => c.id === id);
    return card ? { ...card } : undefined;
  }

  /** Busca por nome, número ou coleção e aplica os filtros selecionados. */
  pesquisar(termo: string, filtros: FiltrosCard): Card[] {
    const t = termo.trim().toLowerCase();
    return this.listar().filter(c =>
      (!t || c.nome.toLowerCase().includes(t) || c.numero.toLowerCase().includes(t) || c.colecao.toLowerCase().includes(t)) &&
      (!filtros.raridade || c.raridade === filtros.raridade) &&
      (!filtros.tipo || c.tipo === filtros.tipo) &&
      (!filtros.colecao || c.colecao === filtros.colecao)
    );
  }

  listarColecoes(): string[] {
    return [...new Set(this.cards.map(c => c.colecao))].sort();
  }

  // ---------- CRUD ----------

  cadastrar(card: Card): Card {
    this.validar(card);
    const novo: Card = {
      ...card,
      id: this.proximoId(),
      dataCadastro: new Date().toISOString().slice(0, 10)
    };
    this.cards.push(novo);
    return { ...novo };
  }

  editar(card: Card): Card {
    this.validar(card);
    const i = this.cards.findIndex(c => c.id === card.id);
    if (i === -1) {
      throw new Error(`Card #${card.id} não encontrado.`);
    }
    this.cards[i] = { ...card };
    return { ...card };
  }

  excluir(id: number): boolean {
    const tamanhoAntes = this.cards.length;
    this.cards = this.cards.filter(c => c.id !== id);
    return this.cards.length < tamanhoAntes;
  }

  // ---------- Estatísticas (dashboard) ----------

  /** Quantidade de cartas distintas cadastradas. */
  total(): number {
    return this.cards.length;
  }

  /** Soma das unidades em estoque. */
  totalUnidades(): number {
    return this.cards.reduce((soma, c) => soma + c.estoque, 0);
  }

  /** Valor do acervo = soma de preço × estoque. */
  valorAcervo(): number {
    return this.cards.reduce((soma, c) => soma + c.preco * c.estoque, 0);
  }

  contagemPorRaridade(): Contagem[] {
    return this.raridades
      .map(r => ({ chave: r, quantidade: this.cards.filter(c => c.raridade === r).length }))
      .filter(item => item.quantidade > 0);
  }

  contagemPorColecao(): Contagem[] {
    return this.listarColecoes()
      .map(col => ({ chave: col, quantidade: this.cards.filter(c => c.colecao === col).length }))
      .sort((a, b) => b.quantidade - a.quantidade);
  }

  maisValiosos(limite = 5): Card[] {
    return this.listar().sort((a, b) => b.preco - a.preco).slice(0, limite);
  }

  /**
   * Histórico simulado dos últimos 10 meses (determinístico pelo id),
   * terminando no preço atual. Será substituído por dados da API.
   */
  historicoPreco(card: Card): number[] {
    const pontos: number[] = [];
    for (let i = 0; i < 10; i++) {
      const oscilacao = Math.sin(card.id + i * 1.7) * 0.06;
      const tendencia = 0.82 + i * 0.02;
      pontos.push(Math.round(card.preco * (tendencia + oscilacao)));
    }
    pontos[9] = card.preco;
    return pontos;
  }

  /** Variação percentual entre o primeiro e o último ponto do histórico. */
  variacaoPreco(card: Card): number {
    const h = this.historicoPreco(card);
    return ((h[h.length - 1] - h[0]) / h[0]) * 100;
  }

  // ---------- Regras internas ----------

  private validar(card: Card): void {
    if (!card.nome?.trim() || !card.colecao?.trim()) {
      throw new Error('Nome e coleção são obrigatórios.');
    }
    if (!(card.preco > 0)) {
      throw new Error('O preço deve ser maior que zero.');
    }
    if (card.estoque < 0) {
      throw new Error('O estoque não pode ser negativo.');
    }
  }

  private proximoId(): number {
    return this.cards.length ? Math.max(...this.cards.map(c => c.id)) + 1 : 1000;
  }
}
