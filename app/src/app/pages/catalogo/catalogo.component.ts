import { Component, DestroyRef, OnInit, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap, tap } from 'rxjs';
import { Card, FiltrosCard, Raridade, Tipo } from '../../models/card.model';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-catalogo',
  standalone: false,
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {

  // inject() porque os campos abaixo (formulários) usam estas dependências na inicialização
  private readonly cardService = inject(CardService);
  private readonly fb = inject(FormBuilder);

  // Estado da tela em signals: o Angular (zoneless) redesenha quando mudam
  cards = signal<Card[]>([]);
  totalAcervo = signal(0);
  colecoes = signal<string[]>([]);
  carregando = signal(true);
  erro = signal('');

  raridades: Raridade[] = this.cardService.raridades;
  tipos: Tipo[] = this.cardService.tipos;

  /** Formulário reativo da barra de busca e filtros. */
  filtros = this.fb.nonNullable.group({
    termo: '',
    raridade: '' as Raridade | '',
    tipo: '' as Tipo | '',
    colecao: ''
  });

  constructor(
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.cardService.listar().subscribe({
      next: cards => {
        this.totalAcervo.set(cards.length);
        this.colecoes.set([...new Set(cards.map(c => c.colecao))].sort());
      },
      error: (e: Error) => this.erro.set(e.message)
    });

    // Cada alteração no formulário vira uma requisição GET /cards?q=...
    // debounceTime espera o usuário parar de digitar e switchMap cancela
    // a requisição anterior se uma nova busca começar.
    this.filtros.valueChanges.pipe(
      startWith(this.filtros.getRawValue()),
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      tap(() => this.carregando.set(true)),
      switchMap(({ termo, ...filtros }) =>
        this.cardService.pesquisar(termo ?? '', filtros as FiltrosCard).pipe(
          catchError((e: Error) => {
            this.erro.set(e.message);
            return of([] as Card[]);
          })
        )
      ),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(cards => {
      this.cards.set(cards);
      this.carregando.set(false);
    });
  }

  limparFiltro(campo: keyof FiltrosCard): void {
    this.filtros.controls[campo].setValue('');
  }

  limparTudo(): void {
    this.filtros.reset();
  }

  get temFiltroAtivo(): boolean {
    const f = this.filtros.value;
    return !!(f.termo || f.raridade || f.tipo || f.colecao);
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
