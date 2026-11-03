import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  links = [
    { rota: '/catalogo', texto: 'Catálogo' },
    { rota: '/dashboard', texto: 'Dashboard' },
    { rota: '/admin/cards', texto: 'Admin' },
    { rota: '/sobre', texto: 'Sobre' },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  sair(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
