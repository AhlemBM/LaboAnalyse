import { Component, OnInit } from '@angular/core';
import { KitsService } from '../../services/kits/kits.service';
import { PanierService } from '../../services/panier/panier.service';
import { AuthService } from '../../services/auth/auth.service'; // Importer AuthService
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-kits',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './kits.component.html',
  styleUrl: './kits.component.css',
})
export class KitsComponent implements OnInit {
  kits: any[] = [];

  constructor(
    private kitService: KitsService,
    private panierService: PanierService,
    private authService: AuthService // Injecter le service AuthService
  ) {}

  ngOnInit(): void {
    this.loadKits();
  }

  loadKits(): void {
    this.kitService.getAllKits().subscribe(
      (data) => {
        this.kits = data;
      },
      (error) => {
        console.error('Error fetching kits:', error);
      }
    );
  }

  commander(kit: any) {
    const userId = this.authService.getUserId(); // Récupérer l'ID de l'utilisateur connecté

    if (!userId) {
      alert("Vous devez être connecté pour ajouter un kit au panier !");
      return;
    }

    if (!kit.quantite || kit.quantite < 1) {
      alert("Veuillez entrer une quantité valide !");
      return;
    }

    const commande = {
      userId: userId, // Utiliser l'ID de l'utilisateur connecté
      kitId: kit.id,
      quantite: kit.quantite,
    };

    this.panierService.ajouterAuPanier(commande).subscribe(
      (response) => {
        alert("Le kit a été ajouté au panier !");
      },
      (error) => {
        console.error("Erreur lors de l'ajout au panier", error);
        alert("Erreur lors de l'ajout au panier !");
      }
    );
  }
}
