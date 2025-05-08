import { Component, OnInit } from '@angular/core';
import { PanierService } from '../../services/panier/panier.service';
import { AuthService } from '../../services/auth/auth.service'; // Importer le service AuthService
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [ FormsModule, CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './panier.component.html',
  styleUrl: './panier.component.css'
})
export class PanierComponent implements OnInit {
  panier: any[] = [];
  userId: string | null = null;
  confirmationEnCours = false;
  adresse = '';


  constructor(private panierService: PanierService, private authService: AuthService,
  private router: Router) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Récupérer l'ID de l'utilisateur connecté à partir du service AuthService
    if (this.userId) {
      this.getPanier();
    } else {
      console.error('Utilisateur non connecté');
    }
  }

  // Récupérer le panier de l'utilisateur
  getPanier() {
    if (this.userId) {
      console.log('id user '+this.userId)
      this.panierService.getPanier(this.userId).subscribe(response => {
        this.panier = response;
        console.log("Panier récupéré :", this.panier);  // Log pour voir la réponse
      }, error => {
        console.error("Erreur lors de la récupération du panier", error);
      });
    }
  }

  // Supprimer un article du panier
  supprimerDuPanier(id: number) {
    this.panierService.supprimerDuPanier(id).subscribe(() => {
      this.panier = this.panier.filter(item => item.id !== id);
    }, error => {
      console.error("Erreur lors de la suppression du panier", error);
    });
  }

  // Calculer le total du panier
  calculerTotal() {
    return this.panier.reduce((total, item) => total + item.kit.prix * item.quantite, 0).toFixed(2);
  }

  // Valider la commande
  validerCommande() {
    this.confirmationEnCours = true;
  }

  confirmerCommande() {
    if (!this.adresse.trim()) {
      alert("Veuillez saisir une adresse de livraison.");
      return;
    }

    // Vérifier que userId est bien défini
    if (!this.userId) {
      alert("Vous devez être connecté pour valider la commande.");
      return;
    }

    const data = {
      userId: this.userId,  // userId ne sera jamais null ici
      adresse: this.adresse
    };

    this.panierService.validerCommande(data).subscribe(() => {
      alert("Commande validée !");
      this.panier = [];
      this.confirmationEnCours = false;
      this.adresse = '';
    }, error => {
      console.error("Erreur lors de la validation de la commande", error);
    });
  }

  updateQuantity(item: any): void {
    // Vous pouvez appeler ici une API pour mettre à jour la quantité dans la base de données si nécessaire
    this.panierService.updatePanier(item).subscribe(response => {
      console.log("Quantité mise à jour", response);
    }, error => {
      console.error("Erreur lors de la mise à jour de la quantité", error);
    });
  }
  modifierQuantite(index: number, delta: number) {
    const item = this.panier[index];
    const nouvelleQuantite = item.quantite + delta;
    if (nouvelleQuantite > 0) {
      item.quantite = nouvelleQuantite;
    }
  }

  supprimerArticle(index: number) {
    this.panier.splice(index, 1);
  }

  allerPaiement() {
    this.router.navigate(['/paiement']);
  }
  annuler() {
    this.router.navigate(['/kits']);
  }


}
