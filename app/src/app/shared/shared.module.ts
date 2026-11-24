import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConservacaoPipe } from '../pipes/conservacao.pipe';

/**
 * Itens usados tanto pelo AppModule quanto pelo AdminModule (lazy loading):
 * diretivas comuns, formulários reativos, rotas e o pipe de conservação.
 */
@NgModule({
  declarations: [ConservacaoPipe],
  imports: [CommonModule],
  exports: [CommonModule, ReactiveFormsModule, RouterModule, ConservacaoPipe]
})
export class SharedModule { }
