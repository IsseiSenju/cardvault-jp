import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Card, Contagem } from '../../models/card.model';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  total = 0;
  unidades = 0;
  valorAcervo = 0;
  ticketMedio = 0;
  porColecao: Contagem[] = [];
  porRaridade: Contagem[] = [];
  maisValiosos: Card[] = [];
  maiorColecao = 1;
  hoje = new Date();

  coresRaridade: Record<string, string> = {
    'Comum': '#2E6BE6',
    'Rara': '#3DDC97',
    'Ultra Rara': '#E3350D',
    'Secreta': '#F2C14E',
    'Promo': '#9B5DE5'
  };

  constructor(private cardService: CardService, private router: Router) {}

  ngOnInit(): void {
    this.total = this.cardService.total();
    this.unidades = this.cardService.totalUnidades();
    this.valorAcervo = this.cardService.valorAcervo();
    this.ticketMedio = this.unidades ? this.valorAcervo / this.unidades : 0;
    this.porColecao = this.cardService.contagemPorColecao();
    this.porRaridade = this.cardService.contagemPorRaridade();
    this.maisValiosos = this.cardService.maisValiosos(5);
    this.maiorColecao = Math.max(1, ...this.porColecao.map(c => c.quantidade));
  }

  percentual(qtd: number): number {
    return this.total ? (qtd / this.total) * 100 : 0;
  }

  abrir(card: Card): void {
    this.router.navigate(['/cards', card.id]);
  }
}
