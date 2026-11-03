import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DetalheCardComponent } from './pages/detalhe-card/detalhe-card.component';
import { AdminCardsComponent } from './pages/admin-cards/admin-cards.component';

import { LoginComponent } from './pages/login/login.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { SobreComponent } from './pages/sobre/sobre.component';

const routes: Routes = [
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent, title: 'CardVault JP — Catálogo' },
  { path: 'cards/:id', component: DetalheCardComponent, title: 'CardVault JP — Detalhe do card' },
  { path: 'admin/cards', component: AdminCardsComponent, title: 'CardVault JP — Cadastro de cards' },
  { path: 'login', component: LoginComponent, title: 'CardVault JP — Login' },
  { path: 'dashboard', component: DashboardComponent, title: 'CardVault JP — Dashboard' },
  { path: 'sobre', component: SobreComponent, title: 'CardVault JP — Sobre' },
  { path: '**', redirectTo: '/catalogo' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
