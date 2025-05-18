import { Component , OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
@Component({
  selector: 'app-contact-user',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contact-user.component.html',
  styleUrl: './contact-user.component.css'
})
export class ContactUserComponent {
  contactForm!: FormGroup;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });
  }

  sendMessage() {
    if (this.contactForm.invalid) return;

    this.http.post('http://localhost:3000/api/contact', this.contactForm.value).subscribe({
      next: () => {
        this.successMessage = 'Message envoyé avec succès !';
        this.errorMessage = '';
        this.contactForm.reset();
      },
      error: () => {
        this.errorMessage = 'Erreur lors de l\'envoi du message.';
        this.successMessage = '';
      },
    });
  }
}
