import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Card, FiltrosCard, Raridade, Tipo } from '../../models/card.model';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-catalogo',
  standalone: false,
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {

  cards: Card[] = [];
  totalAcervo = 0;

  termo = '';
  filtros: FiltrosCard = { raridade: '', tipo: '', colecao: '' };

  raridades: Raridade[] = [];
  tipos: Tipo[] = [];
  colecoes: string[] = [];

  constructor(private cardService: CardService, private router: Router) {}

  ngOnInit(): void {
    this.raridades = this.cardService.raridades;
    this.tipos = this.cardService.tipos;
    this.colecoes = this.cardService.listarColecoes();
    this.totalAcervo = this.cardService.total();
    this.filtrar();
  }

  filtrar(): void {
    this.cards = this.cardService.pesquisar(this.termo, this.filtros);
  }

  limparFiltro(campo: keyof FiltrosCard): void {
    this.filtros[campo] = '';
    this.filtrar();
  }

  limparTudo(): void {
    this.termo = '';
    this.filtros = { raridade: '', tipo: '', colecao: '' };
    this.filtrar();
  }

  get temFiltroAtivo(): boolean {
    return !!(this.termo || this.filtros.raridade || this.filtros.tipo || this.filtros.colecao);
  }

  /** Navegação programática para a página de detalhe. */
  abrirDetalhe(card: Card): void {
    this.router.navigate(['/cards', card.id]);
  }

  classeRaridade(raridade: Raridade): string {
    if (raridade === 'Ultra Rara' || raridade === 'Secreta') return 'gold';
    if (raridade === 'Promo') return 'red';
    return '';
  }
}
