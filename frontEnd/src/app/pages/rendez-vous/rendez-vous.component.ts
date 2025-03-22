import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {RendezVousService} from '../../services/rendez-vous/rendez-vous.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './rendez-vous.component.html',
  styleUrl: './rendez-vous.component.css'
})
export class RendezVousComponent implements OnInit {
  rendezvousForm!: FormGroup;
  userId!: number; // Déclaration dynamique
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private rendezvousService: RendezVousService) {}

  ngOnInit(): void {
    // Récupérer l'ID utilisateur depuis localStorage
    const storedUserId = localStorage.getItem('userId');
    this.userId = storedUserId ? parseInt(storedUserId, 10) : 0;

    this.rendezvousForm = this.fb.group({
      dateHeure: ['', Validators.required],
      notes: ['']
    });
  }

  // Soumettre le formulaire
  prendreRendezvous(): void {
    if (this.rendezvousForm.invalid || !this.userId) {
      this.errorMessage = 'Utilisateur non connecté !';
      return;
    }

    const rendezvousData = {
      patientId: this.userId, // Utiliser l'ID récupéré
      dateHeure: this.rendezvousForm.value.dateHeure,
      notes: this.rendezvousForm.value.notes
    };

    this.rendezvousService.addRendezvous(rendezvousData).subscribe(
      response => {
        this.successMessage = 'Rendez-vous pris avec succès !';
        this.errorMessage = '';
        this.rendezvousForm.reset();
      },
      error => {
        this.successMessage = '';
        this.errorMessage = 'Erreur lors de la prise du rendez-vous.';
      }
    );
  }
}
