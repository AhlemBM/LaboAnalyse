import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { RendezVousService } from '../../services/rendez-vous/rendez-vous.service';
import { TestService } from '../../services/test/test.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  imports: [CommonModule,  ReactiveFormsModule],
  templateUrl: './rendez-vous.component.html',
  styleUrls: ['./rendez-vous.component.css']
})
export class RendezVousComponent implements OnInit {

  rendezvousForm: FormGroup;
  tests: any[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private rendezvousService: RendezVousService, private testService: TestService) {
    // Initialisation du formulaire avec des validateurs
    this.rendezvousForm = this.fb.group({
      nom: ['', Validators.required],  // Ajout du champ "Nom"
      prenom: ['', Validators.required],  // Ajout du champ "Prénom"
      numTel: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],  // Ajout du champ "Numéro de téléphone" (validation simple)
      dateHeure: ['', Validators.required],
      notes: [''],
      testId: ['', Validators.required],
      lieu: ['', Validators.required],
      adresse: ['']
    });
  }

  ngOnInit(): void {
    this.loadTests();
  }

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
  prendreRendezvous() {
    if (this.rendezvousForm.invalid) {
      return;
    }

    const formValues = this.rendezvousForm.value;
    this.rendezvousService.addRendezvous(formValues).subscribe(
      (response) => {
        this.successMessage = 'Rendez-vous pris avec succès';
        this.rendezvousForm.reset();
      },
      (error) => {
        this.errorMessage = 'Erreur lors de la prise du rendez-vous';
        console.error('Erreur lors de la création du rendez-vous', error);
      }
    );
  }
  onLieuChange(event: any): void {
    const lieu = event.target.value;

    if (lieu === 'labo') {
      this.rendezvousForm.get('adresse')?.setValue(''); // Effacer l'adresse si le lieu est 'labo'
    }
  }

}
