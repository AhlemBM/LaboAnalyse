import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Subscription} from 'rxjs';
import {ProfileService} from '../../services/profile/profile.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent  implements OnInit {

  userProfile: any = {};
  userId: string | null = null;
  isEditing: boolean = false;
  editedProfile: any = {};

  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur est connecté
    if (this.authService.isUserLoggedIn()) {
      this.userId = this.authService.getUserId();
     // console.log('userid est'+this.userId)
      if (this.userId) {
        // Récupérer les informations du profil de l'utilisateur connecté
        this.profileService.getProfile(this.userId).subscribe(
          (data) => {
            this.userProfile = data;
            this.editedProfile = { ...data.user }; // Copie des données à modifier
            console.log(data)
          },
          (error) => {
            console.error('Erreur lors de la récupération du profil:', error);
            // Vous pouvez ajouter un message d'erreur ici ou rediriger l'utilisateur.
          }
        );
      }
    } else {
      // Si l'utilisateur n'est pas connecté, redirigez vers la page de login
      this.router.navigate(['/login']);
    }
  }
  editProfile() {
    this.isEditing = true;
  }

  saveProfile() {

    this.profileService.updateUser(this.userId!, this.editedProfile).subscribe({
      next: (res) => {
        this.userProfile.user = { ...this.editedProfile };
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du profil :', err);
      }
    });
  }

  cancelEdit() {
    this.editedProfile = { ...this.userProfile.user };
    this.isEditing = false;
  }
}
