import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface LinkMenu {
  rota: string;
  texto: string;
  somenteAdmin: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  private readonly links: LinkMenu[] = [
    { rota: '/catalogo', texto: 'Catálogo', somenteAdmin: false },
    { rota: '/admin/dashboard', texto: 'Dashboard', somenteAdmin: true },
    { rota: '/admin/cards', texto: 'Admin', somenteAdmin: true },
    { rota: '/sobre', texto: 'Sobre', somenteAdmin: false },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  /** Os links da área administrativa só aparecem para o perfil admin. */
  get linksVisiveis(): LinkMenu[] {
    return this.links.filter(l => !l.somenteAdmin || this.auth.isAdmin());
  }

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
