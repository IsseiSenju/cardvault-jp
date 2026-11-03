import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Perfil } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  aba: 'entrar' | 'cadastrar' = 'entrar';
  perfil: Perfil = 'cliente';

  email = '';
  senha = '';
  lembrar = false;
  erroLogin = '';

  cadastro = { nome: '', email: '', senha: '', confirmacao: '' };
  sucessoCadastro = '';
  erroCadastro = '';

  cartasVitrine = [
    { nome: 'Pyrodrake Kasumi', gradiente: 'g1', giro: -6 },
    { nome: 'Voltilo Tribute', gradiente: 'g3', giro: 2 },
    { nome: 'Psymora Gold', gradiente: 'g5', giro: 8 },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  trocarAba(aba: 'entrar' | 'cadastrar'): void {
    this.aba = aba;
    this.erroLogin = '';
    this.erroCadastro = '';
  }

  entrar(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
    if (this.auth.login(this.email, this.senha, this.perfil)) {
      // Navegação programática conforme o perfil autenticado
      this.router.navigate([this.perfil === 'admin' ? '/admin/cards' : '/catalogo']);
    } else {
      this.erroLogin = 'E-mail, senha ou perfil inválidos.';
    }
  }

  get senhasDiferentes(): boolean {
    return !!this.cadastro.confirmacao && this.cadastro.senha !== this.cadastro.confirmacao;
  }

  cadastrar(form: NgForm): void {
    if (form.invalid || this.senhasDiferentes) {
      form.control.markAllAsTouched();
      return;
    }
    if (!this.auth.registrar(this.cadastro.nome, this.cadastro.email, this.cadastro.senha)) {
      this.erroCadastro = 'Já existe uma conta com este e-mail.';
      return;
    }
    this.email = this.cadastro.email;
    this.perfil = 'cliente';
    this.sucessoCadastro = `Conta criada para ${this.cadastro.nome}! Faça login para continuar.`;
    form.resetForm();
    this.trocarAba('entrar');
  }
}
