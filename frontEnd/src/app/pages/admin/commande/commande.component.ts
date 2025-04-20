import {Component, OnInit} from '@angular/core';
import {PanierService} from '../../../services/panier/panier.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule ],
  templateUrl: './commande.component.html',
  styleUrl: './commande.component.css'
})
export class CommandeComponent implements OnInit{
  commandes: any[] = []; // Liste des commandes
  loading: boolean = true; // Indicateur de chargement

  constructor(private panierService: PanierService, private router: Router) {}

  ngOnInit(): void {
    this.getCommandes();
  }

  // Récupérer toutes les commandes
  getCommandes(): void {
    this.panierService.getAllCommandes().subscribe(
      (data) => {
        this.commandes = data; // Met à jour la liste des commandes
        this.loading = false; // Désactive le chargement une fois les données récupérées
      },
      (error) => {
        console.error('Erreur lors de la récupération des commandes', error);
        this.loading = false; // Désactive le chargement même en cas d'erreur
      }
    );
  }

  // Confirmer la commande par l'admin
  confirmerCommande(id: number): void {
    this.panierService.confirmerCommande(id).subscribe(
      (response) => {
        console.log('Commande confirmée', response);
        this.getCommandes(); // Rafraîchit la liste des commandes après confirmation
      },
      (error) => {
        console.error('Erreur lors de la confirmation de la commande', error);
      }
    );
  }

  getTotal(detail: any): number {
    return detail.quantite * detail.prix;
  }

}

