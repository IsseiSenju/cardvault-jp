import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Card, EstatisticasAcervo } from '../../models/card.model';
import { Proposta, StatusProposta } from '../../models/proposta.model';
import { Mensagem } from '../../models/mensagem.model';
import { CardService } from '../../services/card.service';
import { PropostaService } from '../../services/proposta.service';
import { MensagemService } from '../../services/mensagem.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  dados = signal<EstatisticasAcervo | null>(null);
  propostas = signal<Proposta[]>([]);
  mensagens = signal<Mensagem[]>([]);
  erro = signal('');
  hoje = new Date();

  pendentes = computed(() => this.propostas().filter(p => p.status === 'pendente').length);
  maiorColecao = computed(() => Math.max(1, ...(this.dados()?.porColecao ?? []).map(c => c.quantidade)));

  coresRaridade: Record<string, string> = {
    'Comum': '#2E6BE6',
    'Rara': '#3DDC97',
    'Ultra Rara': '#E3350D',
    'Secreta': '#F2C14E',
    'Promo': '#9B5DE5'
  };

  constructor(
    private cardService: CardService,
    private propostaService: PropostaService,
    private mensagemService: MensagemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // forkJoin dispara as três requisições em paralelo e espera todas terminarem
    forkJoin({
      estatisticas: this.cardService.estatisticas(),
      propostas: this.propostaService.listar(),
      mensagens: this.mensagemService.listar()
    }).subscribe({
      next: r => {
        this.dados.set(r.estatisticas);
        this.propostas.set(r.propostas);
        this.mensagens.set(r.mensagens);
        this.hoje = new Date();
      },
      error: (e: Error) => this.erro.set(e.message)
    });
  }

  percentual(qtd: number): number {
    const total = this.dados()?.total ?? 0;
    return total ? (qtd / total) * 100 : 0;
  }

  responder(proposta: Proposta, status: StatusProposta): void {
    this.propostaService.alterarStatus(proposta.id!, status).subscribe({
      next: atualizada => this.propostas.update(lista => lista.map(p => (p.id === atualizada.id ? atualizada : p))),
      error: (e: Error) => this.erro.set(e.message)
    });
  }

  abrir(card: Card): void {
    this.router.navigate(['/cards', card.id]);
  }
}
