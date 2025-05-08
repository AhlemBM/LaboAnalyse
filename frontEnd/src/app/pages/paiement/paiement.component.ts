import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import {PanierService} from '../../services/panier/panier.service';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './paiement.component.html',
  styleUrl: './paiement.component.css'
})
export class PaiementComponent {
  userId: string | null = null;
  nom = '';
  telephone = '';
  adresse = '';
  modePaiement = 'carte'; // Valeur par défaut
  total = 0;

  constructor(
    private router: Router,
    private panierService: PanierService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) {
      alert("Vous devez être connecté.");
      this.router.navigate(['/login']);
    }

    // On peut aussi récupérer le total du panier via un service ici si nécessaire
    this.panierService.getPanier(this.userId!).subscribe(panier => {
      this.total = panier.reduce(
        (acc: number, item: any) => acc + item.kit.prix * item.quantite,
        0
      );
    });
  }

  confirmerPaiement() {
    if (!this.nom.trim() || !this.telephone.trim() || !this.adresse.trim()) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    const commande = {
      userId: this.userId,
      nom: this.nom,
      telephone: this.telephone,
      adresse: this.adresse,
      modePaiement: this.modePaiement,
      total: this.total
    };

    this.panierService.validerCommande(commande).subscribe(() => {
      alert("Commande confirmée !");
      this.router.navigate(['/kits']);
    }, error => {
      console.error("Erreur paiement :", error);
      alert("Erreur lors de la confirmation.");
    });
  }
}
