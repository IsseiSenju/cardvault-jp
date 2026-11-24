import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Mensagem } from '../models/mensagem.model';

/** Mensagens do formulário "Fale conosco" (coleção /mensagens). */
@Injectable({
  providedIn: 'root'
})
export class MensagemService {

  private readonly url = `${API_URL}/mensagens`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Mensagem[]> {
    return this.http.get<Mensagem[]>(this.url, { params: { _sort: 'id', _order: 'desc' } });
  }

  enviar(mensagem: Omit<Mensagem, 'id' | 'data'>): Observable<Mensagem> {
    return this.http.post<Mensagem>(this.url, { ...mensagem, data: new Date().toISOString() });
  }
}
