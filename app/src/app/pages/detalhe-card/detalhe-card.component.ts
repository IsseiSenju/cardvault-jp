import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../models/card.model';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-detalhe-card',
  standalone: false,
  templateUrl: './detalhe-card.component.html',
  styleUrl: './detalhe-card.component.css'
})
export class DetalheCardComponent implements OnInit {

  card?: Card;
  idSolicitado = 0;
  variacao = 0;
  meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out'];

  /** Pontos do gráfico SVG (viewBox 600x190). */
  pontosGrafico = '';
  areaGrafico = '';
  ultimoPonto = { x: 0, y: 0 };
  escala: { y: number; valor: number }[] = [];

  propostaEnviada = false;
  naListaDesejos = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService
  ) {}

  ngOnInit(): void {
    // Lê o parâmetro :id da rota /cards/:id
    this.route.paramMap.subscribe(params => {
      this.idSolicitado = Number(params.get('id'));
      this.card = this.cardService.buscarPorId(this.idSolicitado);
      this.propostaEnviada = false;
      if (this.card) {
        this.variacao = this.cardService.variacaoPreco(this.card);
        this.montarGrafico(this.cardService.historicoPreco(this.card));
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/catalogo']);
  }

  editar(): void {
    this.router.navigate(['/admin/cards'], { queryParams: { editar: this.card?.id } });
  }

  negociar(): void {
    this.propostaEnviada = true;
  }

  alternarDesejo(): void {
    this.naListaDesejos = !this.naListaDesejos;
  }

  private montarGrafico(historico: number[]): void {
    const min = Math.min(...historico) * 0.95;
    const max = Math.max(...historico) * 1.05;
    const y = (v: number) => 170 - ((v - min) / (max - min)) * 140;
    const pts = historico.map((v, i) => ({ x: 40 + i * 60, y: Math.round(y(v)) }));

    this.pontosGrafico = pts.map(p => `${p.x},${p.y}`).join(' ');
    this.areaGrafico = `40,170 ${this.pontosGrafico} ${pts[pts.length - 1].x},170`;
    this.ultimoPonto = pts[pts.length - 1];
    this.escala = [max, (max + min) / 2, min].map(v => ({ y: Math.round(y(v)), valor: v }));
  }
}
