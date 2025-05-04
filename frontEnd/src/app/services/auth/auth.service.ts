import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  login(email: string ,mdp: string ): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`,{email ,mdp} ).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem('authToken', response.token); // Stocker le token dans localStorage
          localStorage.setItem('userId', response.user.id); // Stocke l'ID de l'utilisateur
        }
      })
    );
  }

  register(nom: string, prenom: string, email: string, motDePasse: string, telephone: string, dateNaissance: string): Observable<any> {
    const body = {
      nom: nom,
      prenom: prenom,
      email: email,
      motDePasse: motDePasse,
      telephone: telephone,
      dateNaissance: dateNaissance
    };

    return this.http.post(`${this.apiUrl}/register`, body);
  }

  // Vérifier si un utilisateur est connecté
  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('authToken'); // Vérifie la présence d'un token d'authentification
  }

  // Obtenir l'ID de l'utilisateur à partir du token ou du stockage local
  getUserId(): string | null {
    const token = localStorage.getItem('authToken');
    console.log("token1"+token)
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Décoder le token JWT
      return decodedToken.userId;
    }
    console.log("token est"+token)
    return null;
  }
  getAllUsers():  Observable<any> {
    return this.http.get(`${this.apiUrl}/user/getAll`);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/delete/${id}`);
  }
  getTestsParMois(userId: string) {
    return this.http.get<any>(`${this.apiUrl}/patient/${userId}/tests-par-mois`);
  }

  getRendezVous(userId: string) {
    return this.http.get<any>(`${this.apiUrl}/patient/${userId}/rendez-vous`);
  }


}
