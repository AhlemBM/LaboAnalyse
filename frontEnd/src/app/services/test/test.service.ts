import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private apiUrl = 'http://localhost:3000/api/test'; // Remplace par ton URL backend

  constructor(private http: HttpClient) {}

  // Récupérer les rendez-vous d'un patient
  getAllTest(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
