import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminCardsComponent } from './admin-cards/admin-cards.component';
import { DashboardComponent } from './dashboard/dashboard.component';

/** Módulo da área administrativa, carregado por lazy loading em /admin. */
@NgModule({
  declarations: [AdminCardsComponent, DashboardComponent],
  imports: [SharedModule, AdminRoutingModule]
})
export class AdminModule { }
