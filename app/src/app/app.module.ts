import { NgModule, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { erroApiInterceptor } from './interceptors/erro-api.interceptor';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DetalheCardComponent } from './pages/detalhe-card/detalhe-card.component';
import { LoginComponent } from './pages/login/login.component';
import { SobreComponent } from './pages/sobre/sobre.component';

registerLocaleData(localePt);

/**
 * Módulo raiz. As telas administrativas (cadastro de cards e dashboard)
 * ficam no AdminModule, carregado sob demanda (lazy loading).
 */
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    CatalogoComponent,
    DetalheCardComponent,
    LoginComponent,
    SobreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([erroApiInterceptor])),
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
