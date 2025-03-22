import { Component } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule,CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  motDePasse: string = '';
  telephone: string = '';
  dateNaissance: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Méthode d'inscription
  register() {
    if (!this.nom || !this.prenom || !this.email || !this.motDePasse || !this.telephone || !this.dateNaissance) {
      this.errorMessage = 'Tous les champs doivent être remplis!';
      return;
    }

    this.authService.register(this.nom, this.prenom, this.email, this.motDePasse, this.telephone, this.dateNaissance)
      .subscribe({
        next: (response) => {
          console.log('Utilisateur inscrit avec succès:', response);
          // Rediriger vers la page de connexion après inscription
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
          console.error('Erreur d\'inscription:', error);
        }
      });
  }

}
