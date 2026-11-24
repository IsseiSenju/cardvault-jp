import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Proposta, StatusProposta } from '../models/proposta.model';

/** Propostas de negociação (coleção /propostas do JSON-Server). */
@Injectable({
  providedIn: 'root'
})
export class PropostaService {

  private readonly url = `${API_URL}/propostas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Proposta[]> {
    return this.http.get<Proposta[]>(this.url, { params: { _sort: 'id', _order: 'desc' } });
  }

  /** Toda proposta nova entra como "pendente" com a data de hoje. */
  enviar(proposta: Omit<Proposta, 'id' | 'status' | 'data'>): Observable<Proposta> {
    return this.http.post<Proposta>(this.url, {
      ...proposta,
      status: 'pendente',
      data: new Date().toISOString().slice(0, 10)
    });
  }

  /** PATCH altera só o campo status. */
  alterarStatus(id: number, status: StatusProposta): Observable<Proposta> {
    return this.http.patch<Proposta>(`${this.url}/${id}`, { status });
  }
}
