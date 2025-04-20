import {Component, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../services/auth/auth.service';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

 // private authService = inject(AuthService);  // Utilisation d'injection pour AuthService
  private router = inject(Router);  // Utilisation d'injection pour Router
  email: string = '';
  mdp: string = '';
  errorMessage: string = '';

  constructor(private authService:AuthService) { }  // Injection correcte de HttpClient

  login() {
    this.authService.login(this.email, this.mdp).subscribe({
      next: (res: any) => {
        // Stocker le rôle dans le localStorage
        const role = res.user?.role || 'user'; // sécuriser le fallback
        localStorage.setItem('role', role);

        // Redirection en fonction du rôle
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password';
        console.error(err);
      }
    });
  }

}
