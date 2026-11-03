import { NgModule, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DetalheCardComponent } from './pages/detalhe-card/detalhe-card.component';
import { AdminCardsComponent } from './pages/admin-cards/admin-cards.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { ConservacaoPipe } from './pipes/conservacao.pipe';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CatalogoComponent,
    DetalheCardComponent,
    AdminCardsComponent,
    LoginComponent,
    DashboardComponent,
    SobreComponent,
    ConservacaoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
