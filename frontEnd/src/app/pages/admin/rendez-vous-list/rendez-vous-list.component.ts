import { Component } from '@angular/core';
import {RendezVousService} from '../../../services/rendez-vous/rendez-vous.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-rendez-vous-list',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './rendez-vous-list.component.html',
  styleUrl: './rendez-vous-list.component.css'
})
export class RendezVousListComponent {
  rendezvousList: any[] = [];

  constructor(private rdvService: RendezVousService) {}

  ngOnInit(): void {
    this.fetchRendezvous();
  }

  fetchRendezvous(): void {
    this.rdvService.getAll().subscribe(data => {
      this.rendezvousList = data;
    });
  }

  toggleStatut(rdv: any): void {
    const nouveauStatut = rdv.statut === 'en attente' ? 'confirmé' : 'en attente';
    this.rdvService.updateStatut(rdv.id, nouveauStatut).subscribe(() => {
      rdv.statut = nouveauStatut;
    });
  }

}
