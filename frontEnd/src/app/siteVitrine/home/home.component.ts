import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';
import {FormsModule,  ReactiveFormsModule} from '@angular/forms';
import {RendezVousComponent} from '../../pages/rendez-vous/rendez-vous.component';
import {ContactUserComponent} from '../../pages/contact-user/contact-user.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ FormsModule,RouterModule ,RouterOutlet  ,
    CommonModule,HeaderComponent, FooterComponent, ReactiveFormsModule, RouterModule,
    ContactUserComponent,
  RendezVousComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  contact = {
    nom: '',
    email: '',
    message: ''
  };

  envoyerMessage() {
    // Ici, tu devras appeler un service backend pour réellement envoyer l’email
    console.log('Formulaire envoyé:', this.contact);

    // Réinitialisation
    this.contact = { nom: '', email: '', message: '' };
    alert('Message envoyé !');
  }


}
