import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { API_URL } from '../api.config';
import {
  Card, CardFormulario, Contagem, EstatisticasAcervo, FiltrosCard, PontoHistorico, Raridade, Tipo
} from '../models/card.model';

/**
 * Centraliza a regra de negócio dos cards. Os dados ficam no JSON-Server
 * e todas as operações são feitas com requisições HTTP (HttpClient):
 *   GET    /cards          listagem e pesquisa
 *   GET    /cards/:id      exibição
 *   POST   /cards          cadastro
 *   PUT    /cards/:id      edição
 *   DELETE /cards/:id      exclusão
 */
@Injectable({
  providedIn: 'root'
})
export class CardService {

  private readonly url = `${API_URL}/cards`;

  readonly raridades: Raridade[] = ['Comum', 'Rara', 'Ultra Rara', 'Secreta', 'Promo'];
  readonly tipos: Tipo[] = ['Fogo', 'Água', 'Planta', 'Elétrico', 'Psíquico', 'Fada'];

  constructor(private http: HttpClient) {}

  // ---------- Consulta ----------

  listar(): Observable<Card[]> {
    return this.http.get<Card[]>(this.url, { params: { _sort: 'nome' } });
  }

  buscarPorId(id: number): Observable<Card> {
    return this.http.get<Card>(`${this.url}/${id}`);
  }

  /**
   * Pesquisa no servidor: `q` faz a busca textual do JSON-Server e os
   * filtros viram parâmetros da URL (ex.: /cards?q=holo&raridade=Rara).
   */
  pesquisar(termo: string, filtros: FiltrosCard): Observable<Card[]> {
    let params = new HttpParams().set('_sort', 'nome');
    if (termo.trim()) params = params.set('q', termo.trim());
    if (filtros.raridade) params = params.set('raridade', filtros.raridade);
    if (filtros.tipo) params = params.set('tipo', filtros.tipo);
    if (filtros.colecao) params = params.set('colecao', filtros.colecao);
    return this.http.get<Card[]>(this.url, { params });
  }

  listarColecoes(): Observable<string[]> {
    return this.listar().pipe(
      map(cards => [...new Set(cards.map(c => c.colecao))].sort())
    );
  }

  // ---------- CRUD ----------

  /** Cadastra um card novo; o id é gerado pelo JSON-Server. */
  cadastrar(dados: CardFormulario): Observable<Card> {
    const erro = this.validar(dados);
    if (erro) return throwError(() => new Error(erro));

    return this.verificarDuplicado(dados).pipe(
      switchMap(() => this.http.post<Card>(this.url, {
        ...dados,
        dataCadastro: this.hoje(),
        historico: [{ mes: this.mesAtual(), valor: dados.preco }]
      }))
    );
  }

  /** Edita o card e registra no histórico quando o preço muda. */
  editar(id: number, dados: CardFormulario): Observable<Card> {
    const erro = this.validar(dados);
    if (erro) return throwError(() => new Error(erro));

    return this.verificarDuplicado(dados, id).pipe(
      switchMap(() => this.buscarPorId(id)),
      switchMap(atual => this.http.put<Card>(`${this.url}/${id}`, {
        ...atual,
        ...dados,
        id,
        historico: this.registrarPreco(atual.historico ?? [], atual.preco, dados.preco)
      }))
    );
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  // ---------- Estatísticas (dashboard) ----------

  estatisticas(): Observable<EstatisticasAcervo> {
    return this.listar().pipe(map(cards => {
      const unidades = cards.reduce((soma, c) => soma + c.estoque, 0);
      const valorAcervo = cards.reduce((soma, c) => soma + c.preco * c.estoque, 0);
      return {
        total: cards.length,
        unidades,
        valorAcervo,
        ticketMedio: unidades ? valorAcervo / unidades : 0,
        porColecao: this.contar(cards, c => c.colecao).sort((a, b) => b.quantidade - a.quantidade),
        porRaridade: this.raridades
          .map(r => ({ chave: r, quantidade: cards.filter(c => c.raridade === r).length }))
          .filter(item => item.quantidade > 0),
        maisValiosos: [...cards].sort((a, b) => b.preco - a.preco).slice(0, 5)
      };
    }));
  }

  /** Variação percentual entre o primeiro e o último ponto do histórico. */
  variacaoPreco(card: Card): number {
    const h = card.historico ?? [];
    if (h.length < 2 || !h[0].valor) return 0;
    return ((h[h.length - 1].valor - h[0].valor) / h[0].valor) * 100;
  }

  // ---------- Regras internas ----------

  /** Regras de negócio que valem mesmo se o formulário for burlado. */
  private validar(card: CardFormulario): string | null {
    if (!card.nome?.trim() || !card.colecao?.trim()) return 'Nome e coleção são obrigatórios.';
    if (!(card.preco > 0)) return 'O preço deve ser maior que zero.';
    if (card.estoque < 0) return 'O estoque não pode ser negativo.';
    return null;
  }

  /** Impede dois cards com a mesma coleção e o mesmo número. */
  private verificarDuplicado(card: CardFormulario, idIgnorado?: number): Observable<void> {
    if (!card.numero?.trim()) {
      return of(undefined);
    }
    const params = new HttpParams().set('colecao', card.colecao.trim()).set('numero', card.numero.trim());
    return this.http.get<Card[]>(this.url, { params }).pipe(
      map(encontrados => {
        if (encontrados.some(c => c.id !== idIgnorado)) {
          throw new Error(`Já existe um card nº ${card.numero} na coleção ${card.colecao}.`);
        }
      })
    );
  }

  /** Atualiza o ponto do mês atual ou acrescenta um novo (mantém 12 meses). */
  private registrarPreco(historico: PontoHistorico[], precoAntigo: number, precoNovo: number): PontoHistorico[] {
    if (precoAntigo === precoNovo) return historico;
    const mes = this.mesAtual();
    const semMesAtual = historico.filter(p => p.mes !== mes);
    return [...semMesAtual, { mes, valor: precoNovo }].slice(-12);
  }

  private contar(cards: Card[], chave: (c: Card) => string): Contagem[] {
    const mapa = new Map<string, number>();
    cards.forEach(c => mapa.set(chave(c), (mapa.get(chave(c)) ?? 0) + 1));
    return [...mapa].map(([k, quantidade]) => ({ chave: k, quantidade }));
  }

  private hoje(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private mesAtual(): string {
    return this.hoje().slice(0, 7);
  }
}
