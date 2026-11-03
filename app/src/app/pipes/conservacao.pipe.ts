import { Pipe, PipeTransform } from '@angular/core';
import { Estado } from '../models/card.model';

/** Converte a sigla do estado de conservação em texto legível. Ex.: 'NM' -> 'Near Mint (NM)'. */
@Pipe({
  name: 'conservacao',
  standalone: false
})
export class ConservacaoPipe implements PipeTransform {

  private readonly nomes: Record<Estado, string> = {
    M: 'Mint',
    NM: 'Near Mint',
    EX: 'Excellent',
    GD: 'Good',
    PL: 'Played'
  };

  transform(estado: Estado | null | undefined): string {
    if (!estado) return '—';
    return `${this.nomes[estado] ?? estado} (${estado})`;
  }
}
