import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendezVousService {
  private apiUrl = 'http://localhost:3000/api/rendezvous'; // Remplace par ton URL backend

  constructor(private http: HttpClient) {}

  // Ajouter un rendez-vous
  addRendezvous(rendezvousData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, rendezvousData);
  }

  // Récupérer les rendez-vous d'un patient
  getRendezvousByPatientId(patientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/patient/${patientId}`);
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  updateStatut(id: number, statut: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, { statut });
  }
}
