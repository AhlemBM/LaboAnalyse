import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RendezVousService } from '../../services/rendez-vous/rendez-vous.service';
import { TestService } from '../../services/test/test.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  tests: any[] = [];  // Utilisation de "any[]" pour le tableau de tests
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private rendezvousService: RendezVousService,
              private testService: TestService) {}

  ngOnInit() {
    this.loadTests();
  }

  loadTests() {
    this.testService.getAllTest().subscribe(
      (data) => {
        console.log('Tests chargés', data);
        this.tests = data;  // Stockage des tests dans le tableau tests
      },
      (error) => {
        console.error('Erreur lors du chargement des tests', error);
        this.errorMessage = 'Erreur lors du chargement des tests';
      }
    );
  }
}
