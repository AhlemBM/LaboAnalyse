import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RendezVousService } from '../../services/rendez-vous/rendez-vous.service';
import { TestService } from '../../services/test/test.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';  // Service pour récupérer l'utilisateur authentifié

// Assurez-vous d'avoir un modèle Test défini


@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rendez-vous.component.html',
  styleUrls: ['./rendez-vous.component.css']
})
export class RendezVousComponent implements OnInit {

  rendezvousForm: FormGroup;
  tests: any[] = [];
  successMessage = '';
  errorMessage = '';
  userId: string | null = null;  // Variable pour stocker le userId

  constructor(
    private fb: FormBuilder,
    private rendezvousService: RendezVousService,
    private testService: TestService,
    private authService: AuthService  // Injection du service d'authentification
  ) {
    // Initialisation du formulaire avec des validateurs
    this.rendezvousForm = this.fb.group({
      nom: ['', Validators.required],  // Champ "Nom"
      prenom: ['', Validators.required],  // Champ "Prénom"
      numTel: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],  // Champ "Numéro de téléphone" (validation simple)
      dateHeure: ['', Validators.required],  // Champ "Date et Heure"
      notes: [''],  // Champ "Notes"
      testId: ['', Validators.required],  // Champ "Test"
      lieu: ['', Validators.required],  // Champ "Lieu"
      adresse: ['']  // Champ "Adresse"
    });
  }

  ngOnInit(): void {
    this.loadTests();  // Charger les tests disponibles au démarrage
    this.userId = this.authService.getUserId();  // Récupérer l'ID de l'utilisateur authentifié
  }

  // Fonction pour charger la liste des tests
  // Fonction pour charger la liste des tests
  loadTests() {
    this.testService.getAllTest().subscribe(
      (data) => {
        this.tests = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des tests', error);
        this.errorMessage = 'Erreur lors du chargement des tests';
      }
    );
  }

  // Fonction pour prendre un rendez-vous
  prendreRendezvous(): void {
    if (this.rendezvousForm.invalid) {
      return;
    }

    const formValues = { ...this.rendezvousForm.value, userId: this.userId };  // Ajouter le userId aux valeurs du formulaire

    this.rendezvousService.addRendezvous(formValues).subscribe(
      (response) => {
        this.successMessage = 'Rendez-vous pris avec succès';
        this.rendezvousForm.reset();  // Réinitialiser le formulaire après succès
      },
      (error) => {
        console.error('Erreur lors de la création du rendez-vous', error);
        this.errorMessage = error?.message || 'Erreur lors de la prise du rendez-vous';
      }
    );
  }

  // Fonction pour gérer le changement de lieu et effacer l'adresse si nécessaire
  onLieuChange(event: Event): void {
    const lieu = (event.target as HTMLSelectElement).value;  // Typage de l'élément événement

    if (lieu === 'labo') {
      this.rendezvousForm.get('adresse')?.setValue('labo');  // Effacer l'adresse si le lieu est 'labo'
    }
  }

}
