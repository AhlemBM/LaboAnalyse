import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResultatsService {
  private apiUrl = 'http://localhost:3000/api/resultat';
  constructor() { }
  private http = inject(HttpClient)


  getResultatsByIdUser(patientId:string): Observable<any>{
    return this.http.get(`${this.apiUrl}/getByUser/${patientId}`)
  }


  downloadAnalyse(resultatId: string): void {
    window.open(`${this.apiUrl}/download/${resultatId}`, '_blank');
  }
}
