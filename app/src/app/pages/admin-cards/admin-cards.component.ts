import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Card, Estado, Gradiente, Raridade, Tipo } from '../../models/card.model';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-admin-cards',
  standalone: false,
  templateUrl: './admin-cards.component.html',
  styleUrl: './admin-cards.component.css'
})
export class AdminCardsComponent implements OnInit {

  cards: Card[] = [];
  filtroTabela = '';

  modelo: Card = this.novoCard();
  editando = false;
  enviado = false;

  mensagem = '';
  tipoMensagem: 'ok' | 'err' = 'ok';

  raridades: Raridade[] = [];
  tipos: Tipo[] = [];
  colecoes: string[] = [];
  estados: Estado[] = ['M', 'NM', 'EX', 'GD', 'PL'];
  gradientes: Gradiente[] = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'];
  anoAtual = new Date().getFullYear();

  constructor(
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.raridades = this.cardService.raridades;
    this.tipos = this.cardService.tipos;
    this.carregar();

    // Permite abrir a edição direto pela URL: /admin/cards?editar=1000
    this.route.queryParamMap.subscribe(params => {
      const id = Number(params.get('editar'));
      if (id) {
        this.iniciarEdicao(id);
      }
    });
  }

  carregar(): void {
    this.cards = this.cardService.pesquisar(this.filtroTabela, { raridade: '', tipo: '', colecao: '' });
    this.colecoes = this.cardService.listarColecoes();
  }

  iniciarEdicao(id: number): void {
    const card = this.cardService.buscarPorId(id);
    if (!card) {
      this.exibirMensagem(`Card #${id} não encontrado.`, 'err');
      return;
    }
    this.modelo = card;
    this.editando = true;
    this.enviado = false;
    this.mensagem = '';
  }

  novo(form: NgForm): void {
    this.modelo = this.novoCard();
    this.editando = false;
    this.enviado = false;
    form.resetForm(this.modelo);
    this.router.navigate(['/admin/cards']);
  }

  salvar(form: NgForm): void {
    this.enviado = true;
    if (form.invalid) {
      this.exibirMensagem('Corrija os campos destacados antes de salvar.', 'err');
      return;
    }

    try {
      if (this.editando) {
        const card = this.cardService.editar(this.modelo);
        this.exibirMensagem(`✓ Card "${card.nome}" atualizado com sucesso.`, 'ok');
      } else {
        const card = this.cardService.cadastrar(this.modelo);
        this.exibirMensagem(`✓ Card "${card.nome}" cadastrado com o código #${card.id}.`, 'ok');
      }
    } catch (e) {
      this.exibirMensagem((e as Error).message, 'err');
      return;
    }

    this.modelo = this.novoCard();
    this.editando = false;
    this.enviado = false;
    form.resetForm(this.modelo);
    this.carregar();
    // Navegação programática: volta para a lista (remove ?editar da URL)
    this.router.navigate(['/admin/cards']);
  }

  excluir(card: Card, form: NgForm): void {
    if (!confirm(`Deseja realmente excluir o card "${card.nome}" (#${card.id})?`)) {
      return;
    }
    if (this.cardService.excluir(card.id)) {
      if (this.editando && this.modelo.id === card.id) {
        this.novo(form);
      }
      this.carregar();
      this.exibirMensagem(`Card "${card.nome}" excluído.`, 'ok');
    }
  }

  classeRaridade(raridade: Raridade): string {
    if (raridade === 'Ultra Rara' || raridade === 'Secreta') return 'gold';
    if (raridade === 'Promo') return 'red';
    return '';
  }

  private exibirMensagem(texto: string, tipo: 'ok' | 'err'): void {
    this.mensagem = texto;
    this.tipoMensagem = tipo;
  }

  private novoCard(): Card {
    return {
      id: 0,
      nome: '',
      colecao: '',
      numero: '',
      tipo: 'Fogo',
      raridade: 'Comum',
      idioma: 'Japonês',
      variante: '',
      estado: 'NM',
      preco: 0,
      estoque: 1,
      ano: new Date().getFullYear(),
      gradiente: 'g1',
      dataCadastro: ''
    };
  }
}
