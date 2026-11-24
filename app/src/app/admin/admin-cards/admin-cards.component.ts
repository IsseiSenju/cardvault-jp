import { Component, DestroyRef, OnInit, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Card, CardFormulario, Estado, Gradiente, Raridade, Tipo } from '../../models/card.model';
import { CardService } from '../../services/card.service';
import { PADRAO_NUMERO_CARTA, naoVazio } from '../../shared/validadores';

type CampoCard = keyof CardFormulario;

@Component({
  selector: 'app-admin-cards',
  standalone: false,
  templateUrl: './admin-cards.component.html',
  styleUrl: './admin-cards.component.css'
})
export class AdminCardsComponent implements OnInit {

  // inject() porque os campos abaixo (formulários) usam estas dependências na inicialização
  private readonly cardService = inject(CardService);
  private readonly fb = inject(FormBuilder);

  cards = signal<Card[]>([]);
  colecoes = signal<string[]>([]);
  editandoId = signal<number | null>(null);
  salvando = signal(false);
  mensagem = signal('');
  tipoMensagem = signal<'ok' | 'err'>('ok');

  raridades: Raridade[] = this.cardService.raridades;
  tipos: Tipo[] = this.cardService.tipos;
  idiomas = ['Japonês', 'Inglês', 'Português'];
  estados: Estado[] = ['M', 'NM', 'EX', 'GD', 'PL'];
  gradientes: Gradiente[] = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'];
  anoAtual = new Date().getFullYear();

  /** Filtro da tabela (FormControl isolado, sem <form>). */
  filtroTabela = new FormControl('', { nonNullable: true });

  /** Formulário reativo de inclusão/edição com as regras de validação. */
  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60), naoVazio()]],
    colecao: ['', [Validators.required, naoVazio()]],
    numero: ['', [Validators.pattern(PADRAO_NUMERO_CARTA)]],
    raridade: ['Comum' as Raridade, Validators.required],
    tipo: ['Fogo' as Tipo, Validators.required],
    idioma: ['Japonês', Validators.required],
    variante: ['', Validators.maxLength(40)],
    estado: ['NM' as Estado, Validators.required],
    preco: [0, [Validators.required, Validators.min(0.01)]],
    estoque: [1, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
    ano: [this.anoAtual, [Validators.required, Validators.min(1996), Validators.max(this.anoAtual)]],
    gradiente: ['g1' as Gradiente, Validators.required]
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.carregar();

    this.filtroTabela.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.carregar());

    // Permite abrir a edição direto pela URL: /admin/cards?editar=1000
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const id = Number(params.get('editar'));
      if (id) {
        this.iniciarEdicao(id);
      }
    });
  }

  carregar(): void {
    this.cardService.pesquisar(this.filtroTabela.value, { raridade: '', tipo: '', colecao: '' }).subscribe({
      next: cards => this.cards.set(cards),
      error: (e: Error) => this.exibirMensagem(e.message, 'err')
    });
    this.cardService.listarColecoes().subscribe({
      next: colecoes => this.colecoes.set(colecoes),
      error: () => this.colecoes.set([])
    });
  }

  iniciarEdicao(id: number): void {
    this.cardService.buscarPorId(id).subscribe({
      next: card => {
        // patchValue ignora os campos que não existem no formulário (id, historico...)
        this.form.reset();
        this.form.patchValue(card);
        this.editandoId.set(card.id);
        this.mensagem.set('');
      },
      error: () => this.exibirMensagem(`Card #${id} não encontrado.`, 'err')
    });
  }

  novo(): void {
    this.form.reset();
    this.editandoId.set(null);
    this.mensagem.set('');
    this.router.navigate(['/admin/cards']);
  }

  salvar(): void {
    // Bloqueia o envio para a API enquanto houver campo inválido
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.exibirMensagem('Corrija os campos destacados antes de salvar.', 'err');
      return;
    }

    const dados = this.form.getRawValue();
    const id = this.editandoId();
    const requisicao = id ? this.cardService.editar(id, dados) : this.cardService.cadastrar(dados);

    this.salvando.set(true);
    requisicao.subscribe({
      next: card => {
        this.exibirMensagem(id
          ? `✓ Card "${card.nome}" atualizado com sucesso.`
          : `✓ Card "${card.nome}" cadastrado com o código #${card.id}.`, 'ok');
        this.salvando.set(false);
        this.form.reset();
        this.editandoId.set(null);
        this.carregar();
        // Navegação programática: volta para a lista (remove ?editar da URL)
        this.router.navigate(['/admin/cards']);
      },
      error: (e: Error) => {
        this.exibirMensagem(e.message, 'err');
        this.salvando.set(false);
      }
    });
  }

  excluir(card: Card): void {
    if (!confirm(`Deseja realmente excluir o card "${card.nome}" (#${card.id})?`)) {
      return;
    }
    this.cardService.excluir(card.id).subscribe({
      next: () => {
        if (this.editandoId() === card.id) {
          this.novo();
        }
        this.carregar();
        this.exibirMensagem(`Card "${card.nome}" excluído.`, 'ok');
      },
      error: (e: Error) => this.exibirMensagem(e.message, 'err')
    });
  }

  /** Campo inválido e já tocado: borda vermelha + mensagem. */
  invalido(campo: CampoCard): boolean {
    const c = this.form.controls[campo];
    return c.invalid && c.touched;
  }

  /** Campo alterado pelo usuário e válido: borda verde. */
  valido(campo: CampoCard): boolean {
    const c = this.form.controls[campo];
    return c.valid && c.dirty;
  }

  erro(campo: CampoCard, tipo: string): boolean {
    return this.form.controls[campo].hasError(tipo);
  }

  classeRaridade(raridade: Raridade): string {
    if (raridade === 'Ultra Rara' || raridade === 'Secreta') return 'gold';
    if (raridade === 'Promo') return 'red';
    return '';
  }

  private exibirMensagem(texto: string, tipo: 'ok' | 'err'): void {
    this.mensagem.set(texto);
    this.tipoMensagem.set(tipo);
  }
}
