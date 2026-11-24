import { Component, signal, inject } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Perfil } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { PADRAO_EMAIL, camposIguais, emailUnico, naoVazio } from '../../shared/validadores';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  // inject() porque os campos abaixo (formulários) usam estas dependências na inicialização
  private readonly fb = inject(FormBuilder);

  aba = signal<'entrar' | 'cadastrar'>('entrar');
  enviando = signal(false);
  erroLogin = signal('');
  sucessoCadastro = signal('');
  erroCadastro = signal('');

  cartasVitrine = [
    { nome: 'Pyrodrake Kasumi', gradiente: 'g1', giro: -6 },
    { nome: 'Voltilo Tribute', gradiente: 'g3', giro: 2 },
    { nome: 'Psymora Gold', gradiente: 'g5', giro: 8 },
  ];

  /** Formulário reativo de login. */
  loginForm = this.fb.nonNullable.group({
    perfil: ['cliente' as Perfil],
    email: ['', [Validators.required, Validators.pattern(PADRAO_EMAIL)]],
    senha: ['', [Validators.required, Validators.minLength(8)]],
    lembrar: [false]
  });

  /**
   * Formulário reativo de cadastro: o e-mail tem um validador assíncrono
   * (consulta a API) e o grupo valida se as senhas conferem.
   */
  cadastroForm = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3), naoVazio()]],
    email: ['', {
      validators: [Validators.required, Validators.pattern(PADRAO_EMAIL)],
      asyncValidators: [emailUnico(email => this.auth.emailDisponivel(email))],
      updateOn: 'change'
    }],
    senha: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[A-Za-z]).+$/)]],
    confirmacao: ['', Validators.required]
  }, { validators: camposIguais('senha', 'confirmacao') });

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  trocarAba(aba: 'entrar' | 'cadastrar'): void {
    this.aba.set(aba);
    this.erroLogin.set('');
    this.erroCadastro.set('');
  }

  entrar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, senha, perfil, lembrar } = this.loginForm.getRawValue();
    this.enviando.set(true);
    this.erroLogin.set('');

    this.auth.login(email, senha, perfil, lembrar).subscribe({
      next: usuario => {
        this.enviando.set(false);
        if (!usuario) {
          this.erroLogin.set('E-mail, senha ou perfil inválidos.');
          return;
        }
        // Volta para a página protegida que o guard bloqueou, se houver
        const retorno = this.route.snapshot.queryParamMap.get('retorno');
        this.router.navigateByUrl(retorno ?? (usuario.perfil === 'admin' ? '/admin/cards' : '/catalogo'));
      },
      error: (e: Error) => {
        this.enviando.set(false);
        this.erroLogin.set(e.message);
      }
    });
  }

  cadastrar(): void {
    if (this.cadastroForm.invalid || this.cadastroForm.pending) {
      this.cadastroForm.markAllAsTouched();
      return;
    }
    const { nome, email, senha } = this.cadastroForm.getRawValue();
    this.enviando.set(true);

    this.auth.registrar(nome, email, senha).subscribe({
      next: usuario => {
        this.enviando.set(false);
        this.sucessoCadastro.set(`Conta criada para ${usuario.nome}! Faça login para continuar.`);
        this.loginForm.reset({ perfil: 'cliente', email: usuario.email, senha: '', lembrar: false });
        this.cadastroForm.reset();
        this.trocarAba('entrar');
      },
      error: (e: Error) => {
        this.enviando.set(false);
        this.erroCadastro.set(e.message);
      }
    });
  }

  /** Campo inválido e já tocado. */
  invalido(controle: AbstractControl): boolean {
    return controle.invalid && controle.touched;
  }

  get senhasDiferentes(): boolean {
    return this.cadastroForm.hasError('camposDiferentes') && this.cadastroForm.controls.confirmacao.touched;
  }
}
