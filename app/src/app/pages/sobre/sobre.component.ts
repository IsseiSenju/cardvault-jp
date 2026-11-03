import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CardService } from '../../services/card.service';

@Component({
  selector: 'app-sobre',
  standalone: false,
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.css'
})
export class SobreComponent implements OnInit {

  totalCartas = 0;
  valores = ['Autenticidade', 'Transparência', 'Comunidade', 'Preservação'];
  assuntos = ['Avaliação de carta', 'Compra e venda', 'Consignação de coleção', 'Outro assunto'];

  contato = { nome: '', email: '', assunto: 'Avaliação de carta', mensagem: '' };
  enviadoPara = '';

  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.totalCartas = this.cardService.totalUnidades();
  }

  enviar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    this.enviadoPara = this.contato.nome;
    this.contato = { nome: '', email: '', assunto: 'Avaliação de carta', mensagem: '' };
    form.resetForm(this.contato);
  }
}
