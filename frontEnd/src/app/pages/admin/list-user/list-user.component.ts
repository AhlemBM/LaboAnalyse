import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'] // attention à 'styleUrls' avec un "s"
})
export class ListUserComponent implements OnInit {
  users: any[] = [];

  constructor(private userService: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: any) => {
        console.log('Réponse API :', data);
        this.users = data.users; // ✅ important : accéder à la clé 'users'
      },
      error: (err) => console.error('Erreur chargement utilisateurs :', err)
    });
  }

  deleteUser(id: number): void {
    if (confirm("Tu veux vraiment supprimer cet utilisateur ?")) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Erreur suppression :', err)
      });
    }
  }
}
