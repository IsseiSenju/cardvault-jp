import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCardsComponent } from './admin-cards/admin-cards.component';
import { DashboardComponent } from './dashboard/dashboard.component';

/** Rotas filhas de /admin (o guard fica na rota pai, em app-routing). */
const routes: Routes = [
  { path: '', redirectTo: 'cards', pathMatch: 'full' },
  { path: 'cards', component: AdminCardsComponent, title: 'CardVault JP — Cadastro de cards' },
  { path: 'dashboard', component: DashboardComponent, title: 'CardVault JP — Dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
