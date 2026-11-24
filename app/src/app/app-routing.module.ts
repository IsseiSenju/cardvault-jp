import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { adminGuard } from './guards/admin.guard';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DetalheCardComponent } from './pages/detalhe-card/detalhe-card.component';
import { LoginComponent } from './pages/login/login.component';
import { SobreComponent } from './pages/sobre/sobre.component';

const routes: Routes = [
  { path: '', redirectTo: '/catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent, title: 'CardVault JP — Catálogo' },
  { path: 'cards/:id', component: DetalheCardComponent, title: 'CardVault JP — Detalhe do card' },
  { path: 'login', component: LoginComponent, title: 'CardVault JP — Login' },
  { path: 'sobre', component: SobreComponent, title: 'CardVault JP — Sobre' },
  {
    // Área administrativa: lazy loading + route guard
    path: 'admin',
    canMatch: [adminGuard],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { path: 'dashboard', redirectTo: '/admin/dashboard' },
  { path: '**', redirectTo: '/catalogo' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
