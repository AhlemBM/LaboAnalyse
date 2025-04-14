import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KitsService {

  private apiUrl = 'http://localhost:3000/api/kits'; // URL de votre API

  constructor(private http: HttpClient) { }

  // Récupérer tous les kits
  getAllKits(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAll`);
  }

  add(kit: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, kit);
  }

  update(id: number, kit: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, kit);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

}
