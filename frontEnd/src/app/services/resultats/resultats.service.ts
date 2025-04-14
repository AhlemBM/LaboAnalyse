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

// Ajouter un résultat avec un fichier d'analyse
  addResultat(resultatData: any, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('patientId', resultatData.patientId);
    formData.append('testId', resultatData.testId);
    formData.append('analyse', file, file.name);

    return this.http.post(`${this.apiUrl}/add`, formData);
  }

  // Récupérer tous les résultats
  getAllResultats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
// Supprimer un résultat
  deleteResultat(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Récupérer un résultat par ID
  getResultatById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${id}`);
  }


  getResultatsByIdUser(patientId:string): Observable<any>{
    return this.http.get(`${this.apiUrl}/getByUser/${patientId}`)
  }

  downloadAnalyse(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${id}`, { responseType: 'blob' });
  }

}
