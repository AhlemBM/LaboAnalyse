import { Component, OnInit } from '@angular/core';
import { ResultatsService } from '../../../services/resultats/resultats.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestService } from '../../../services/test/test.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-resultat',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './resultat.component.html',
  styleUrl: './resultat.component.css'
})
export class ResultatComponent implements OnInit {
  resultats: any[] = [];
  tests: any[] = [];
  user: any[] = [];
  form: FormGroup;
  showModal = false;
  selectedFile: File | null = null;

  constructor(
    private resultatService: ResultatsService,
    private testService: TestService,
    private userService: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      patientId: ['', Validators.required],
      testId: ['', Validators.required],
      analyse: [null, Validators.required]  // Garder la validation pour le fichier
    });
  }

  ngOnInit(): void {
    this.loadResultats();
    this.loadTests();
    this.loadPatients();
  }

  loadResultats(): void {
    this.resultatService.getAllResultats().subscribe(data => {
      this.resultats = data;
    });
  }

  loadTests(): void {
    this.testService.getAllTest().subscribe(data => {
      this.tests = data;
    });
  }

  loadPatients(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.user = data.users; // Now, we directly assign the users array to this.user
      console.log('users are', this.user); // Logs the array of users
    });
  }

  openModal(): void {
    this.form.reset();
    this.selectedFile = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.form.patchValue({
        analyse: this.selectedFile
      });
    }
  }

  submit(): void {
    console.log('Form Valid:', this.form.valid);
    console.log('Form Values:', this.form.value);
    console.log('File Selected:', this.selectedFile);

    if (this.form.valid && this.selectedFile) {
      this.resultatService.addResultat(this.form.value, this.selectedFile).subscribe(() => {
        this.loadResultats();
        this.closeModal();
      });
    }
  }

  delete(id: number): void {
    if (confirm("Confirmer la suppression ?")) {
      this.resultatService.deleteResultat(id).subscribe(() => {
        this.loadResultats();
      });
    }
  }

  download(id: string): void {
    this.resultatService.downloadAnalyse(id).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analyse.pdf';
      a.click();
      window.URL.revokeObjectURL(url); // libérer l'URL après le téléchargement
    });
  }
}
