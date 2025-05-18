import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { RendezVousService } from '../../services/rendez-vous/rendez-vous.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {ContactUserComponent} from '../contact-user/contact-user.component';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule, ContactUserComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  rendezvous: any[] = [];
  totalValidRendezvous = 0;
  currentMonthConfirmeRendezvous = 0;
  nextConfirmeRendezvous: string = '';

  currentDate = new Date();
  calendarDays: { date: Date, rendezvous: any[] }[] = [];

  constructor(
    private rendezvousService: RendezVousService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.getRendezvous(userId);
    }
  }

  getRendezvous(userId: string): void {
    this.rendezvousService.getRendezvousByPatientId(userId).subscribe((data) => {
      this.rendezvous = data;
      this.totalValidRendezvous = this.countByStatus(data, 'confirmé');
      this.currentMonthConfirmeRendezvous = this.countCurrentMonthConfirmed(data);
      this.nextConfirmeRendezvous = this.getNextConfirmedDate(data);
      this.prepareChartData(data);
      this.generateCalendarDays();
    });
  }

  countByStatus(rendezvous: any[], status: string): number {
    return rendezvous.filter(r => r.statut === status).length;
  }

  countCurrentMonthConfirmed(rendezvous: any[]): number {
    const now = new Date();
    return rendezvous.filter(r => {
      const date = new Date(r.dateHeure);
      return r.statut === 'confirmé' &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();
    }).length;
  }

  getNextConfirmedDate(rendezvous: any[]): string {
    const now = new Date();
    const next = rendezvous
      .filter(r => r.statut === 'confirmé' && new Date(r.dateHeure) > now)
      .sort((a, b) => new Date(a.dateHeure).getTime() - new Date(b.dateHeure).getTime())[0];
    return next ? new Date(next.dateHeure).toLocaleDateString('fr-FR') : 'Aucun';
  }

  prepareChartData(rendezvous: any[]) {
    const monthlyCount = Array(12).fill(0);

    rendezvous.forEach(r => {
      if (r.statut === 'confirmé') {
        const month = new Date(r.dateHeure).getMonth();
        monthlyCount[month]++;
      }
    });

    const ctx = document.getElementById('validRendezvousChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [
            'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
            'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
          ],
          datasets: [{
            label: 'Rendez-vous confirmés',
            data: monthlyCount,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Nombre'
              }
            }
          }
        }
      });
    }
  }

  navigateMonth(offset: number): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + offset, 1);
    this.generateCalendarDays();
  }

  generateCalendarDays(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);

    this.calendarDays = Array.from({ length: lastDay.getDate() }, (_, i) => {
      const date = new Date(year, month, i + 1);
      const rdvs = this.rendezvous.filter(r => new Date(r.dateHeure).toDateString() === date.toDateString());
      return { date, rendezvous: rdvs };
    });
  }

  getRdvClass(rdv: any): string {
    switch (rdv.statut) {
      case 'confirmé':
        return 'rdv-confirmed'; // Jaune
      case 'en attente':
        return 'rdv-pending'; // Orange
      case 'validé':
        return 'rdv-valid'; // Bleu
      case 'annulé':
        return 'rdv-cancelled'; // Rouge
      default:
        return ''; // Aucune classe pour les autres statuts
    }
  }

  formatDate(date: Date): string {
    const jours = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return `${jours[date.getDay()]} ${date.getDate()}`;
  }
}
