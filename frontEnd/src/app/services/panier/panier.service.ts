import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanierService {
  private apiUrl = 'http://localhost:3000/api/panier'; // Remplace par ton URL de backend

  constructor(private http: HttpClient) {}

  // Ajouter un kit au panier
  ajouterAuPanier(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data);
  }

  // Récupérer le panier de l'utilisateur
  getPanier(userId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${userId}`);
  }

  // Supprimer un article du panier
  supprimerDuPanier(id: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  // Vider tout le panier
  viderPanier(userId: any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`);
  }

  // Mettre à jour la quantité d'un article dans le panier
  updatePanier(item: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${item.id}`, { quantite: item.quantite });
  }

  // Valider la commande (en envoyant userId et adresse)
  validerCommande(data: { userId: string, adresse: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/valider`, data);
  }

  // Récupérer toutes les commandes
  getAllCommandes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // Confirmer une commande (côté admin)
  confirmerCommande(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/confirmer`, {});
  }
}
