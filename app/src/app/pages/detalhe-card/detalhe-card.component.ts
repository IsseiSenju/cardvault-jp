import { Component, DestroyRef, OnInit, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Card, PontoHistorico } from '../../models/card.model';
import { CardService } from '../../services/card.service';
import { AuthService } from '../../services/auth.service';
import { PropostaService } from '../../services/proposta.service';
import { PADRAO_EMAIL, naoVazio } from '../../shared/validadores';

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

type CampoProposta = 'nome' | 'email' | 'valorOferecido' | 'mensagem';

@Component({
  selector: 'app-detalhe-card',
  standalone: false,
  templateUrl: './detalhe-card.component.html',
  styleUrl: './detalhe-card.component.css'
})
export class DetalheCardComponent implements OnInit {

  // inject() porque os campos abaixo (formulários) usam estas dependências na inicialização
  private readonly fb = inject(FormBuilder);

  card = signal<Card | null>(null);
  carregando = signal(true);
  erro = signal('');
  idSolicitado = 0;
  variacao = 0;

  /** Pontos do gráfico SVG (viewBox 600x190). */
  pontosGrafico = '';
  areaGrafico = '';
  ultimoPonto = { x: 0, y: 0 };
  escala: { y: number; valor: number }[] = [];
  rotulos: { x: number; texto: string }[] = [];

  naListaDesejos = false;
  mostrarProposta = signal(false);
  enviandoProposta = signal(false);
  propostaEnviada = signal('');
  erroProposta = signal('');

  /** Formulário reativo da proposta de negociação. */
  proposta = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), naoVazio()]],
    email: ['', [Validators.required, Validators.pattern(PADRAO_EMAIL)]],
    valorOferecido: [0, [Validators.required, Validators.min(1)]],
    mensagem: ['', [Validators.maxLength(300)]]
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService,
    private propostaService: PropostaService,
    public auth: AuthService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    // Lê o :id da rota e busca o card na API (switchMap troca de card se a URL mudar)
    this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      tap(id => {
        this.idSolicitado = id;
        this.erro.set('');
        this.carregando.set(true);
        this.mostrarProposta.set(false);
        this.propostaEnviada.set('');
      }),
      switchMap(id => this.cardService.buscarPorId(id).pipe(
        catchError((e: Error) => {
          this.erro.set(e.message);
          return of(null);
        })
      )),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(card => {
      this.card.set(card);
      this.carregando.set(false);
      if (card) {
        this.variacao = this.cardService.variacaoPreco(card);
        this.montarGrafico(card.historico ?? []);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/catalogo']);
  }

  editar(): void {
    this.router.navigate(['/admin/cards'], { queryParams: { editar: this.card()?.id } });
  }

  abrirProposta(card: Card): void {
    const usuario = this.auth.usuario();
    this.proposta.reset({
      nome: usuario?.nome ?? '',
      email: usuario?.email ?? '',
      valorOferecido: card.preco,
      mensagem: ''
    });
    // Regra de negócio: a oferta não pode passar do dobro do preço anunciado
    this.proposta.controls.valorOferecido.setValidators([
      Validators.required, Validators.min(1), Validators.max(card.preco * 2)
    ]);
    this.proposta.controls.valorOferecido.updateValueAndValidity();
    this.erroProposta.set('');
    this.mostrarProposta.set(true);
  }

  enviarProposta(card: Card): void {
    if (this.proposta.invalid) {
      this.proposta.markAllAsTouched();
      return;
    }
    this.enviandoProposta.set(true);
    const dados = this.proposta.getRawValue();
    this.propostaService.enviar({ ...dados, cardId: card.id, cardNome: card.nome }).subscribe({
      next: () => {
        const valor = dados.valorOferecido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        this.propostaEnviada.set(`Proposta de ${valor} enviada para "${card.nome}". Você será avisado por e-mail.`);
        this.mostrarProposta.set(false);
        this.enviandoProposta.set(false);
      },
      error: (e: Error) => {
        this.erroProposta.set(e.message);
        this.enviandoProposta.set(false);
      }
    });
  }

  /** true quando o campo deve aparecer em vermelho. */
  invalido(campo: CampoProposta): boolean {
    const c = this.proposta.controls[campo];
    return c.invalid && c.touched;
  }

  alternarDesejo(): void {
    this.naListaDesejos = !this.naListaDesejos;
  }

  private montarGrafico(historico: PontoHistorico[]): void {
    if (historico.length < 2) {
      this.pontosGrafico = '';
      return;
    }
    const valores = historico.map(p => p.valor);
    const min = Math.min(...valores) * 0.95;
    const max = Math.max(...valores) * 1.05;
    const passo = 540 / (historico.length - 1);
    const y = (v: number) => 170 - ((v - min) / (max - min)) * 140;
    const pts = historico.map((p, i) => ({ x: Math.round(50 + i * passo), y: Math.round(y(p.valor)) }));

    this.pontosGrafico = pts.map(p => `${p.x},${p.y}`).join(' ');
    this.areaGrafico = `${pts[0].x},170 ${this.pontosGrafico} ${pts[pts.length - 1].x},170`;
    this.ultimoPonto = pts[pts.length - 1];
    this.escala = [max, (max + min) / 2, min].map(v => ({ y: Math.round(y(v)), valor: v }));
    this.rotulos = historico.map((p, i) => ({ x: pts[i].x - 8, texto: MESES[Number(p.mes.slice(5, 7)) - 1] }));
  }
}
