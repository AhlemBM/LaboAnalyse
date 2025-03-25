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

}
