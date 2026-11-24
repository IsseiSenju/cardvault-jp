import { Component, OnInit, signal, inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CardService } from '../../services/card.service';
import { MensagemService } from '../../services/mensagem.service';
import { PADRAO_EMAIL, naoVazio } from '../../shared/validadores';

@Component({
  selector: 'app-sobre',
  standalone: false,
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.css'
})
export class SobreComponent implements OnInit {

  // inject() porque os campos abaixo (formulários) usam estas dependências na inicialização
  private readonly fb = inject(FormBuilder);

  totalCartas = signal(0);
  enviadoPara = signal('');
  erro = signal('');
  enviando = signal(false);

  valores = ['Autenticidade', 'Transparência', 'Comunidade', 'Preservação'];
  assuntos = ['Avaliação de carta', 'Compra e venda', 'Consignação de coleção', 'Outro assunto'];

  /** Formulário reativo "Fale conosco" (POST /mensagens). */
  contato = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), naoVazio()]],
    email: ['', [Validators.required, Validators.pattern(PADRAO_EMAIL)]],
    assunto: ['Avaliação de carta', Validators.required],
    mensagem: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  });

  constructor(
    private cardService: CardService,
    private mensagemService: MensagemService
  ) {}

  ngOnInit(): void {
    this.cardService.estatisticas().subscribe({
      next: e => this.totalCartas.set(e.unidades),
      error: () => this.totalCartas.set(0)
    });
  }

  enviar(): void {
    if (this.contato.invalid) {
      this.contato.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.erro.set('');
    const dados = this.contato.getRawValue();

    this.mensagemService.enviar(dados).subscribe({
      next: () => {
        this.enviadoPara.set(dados.nome);
        this.contato.reset();
        this.enviando.set(false);
      },
      error: (e: Error) => {
        this.erro.set(e.message);
        this.enviando.set(false);
      }
    });
  }

  invalido(controle: AbstractControl): boolean {
    return controle.invalid && controle.touched;
  }
}
