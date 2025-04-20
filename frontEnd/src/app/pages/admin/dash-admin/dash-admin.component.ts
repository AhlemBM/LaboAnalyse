import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dash-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './dash-admin.component.html',
  styleUrl: './dash-admin.component.css'
})
export class DashAdminComponent implements OnInit {
  rendezvousByMonth: { [key: string]: number } = {};
  testCountsByMonth: { [key: string]: number } = {};
  confirmedCountByMonth: { [key: string]: number } = {};

  testChart?: Chart;
  confirmedChart?: Chart;
  rendezvousChart?: Chart;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTests();
    this.loadConfirmedCommandes();
    this.loadRendezvous();
  }

  // 🧪 TESTS
  loadTests() {
    this.testCountsByMonth = {};
    const months = this.getMonthLabels();

    months.forEach(m => this.testCountsByMonth[m] = 0);

    this.http.get<any[]>('http://localhost:3000/api/test/all').subscribe(data => {
      data.forEach(item => {
        const rawDate = item.date || item.createdAt;
        const date = new Date(rawDate);
        const key = date.toLocaleString('default', { month: 'long' });
        if (this.testCountsByMonth[key] !== undefined) {
          this.testCountsByMonth[key]++;
        }
      });

      this.createTestChart();
    });
  }



  // ✅ COMMANDES
  loadConfirmedCommandes() {
    const months = this.getMonthLabels();
    months.forEach(m => this.confirmedCountByMonth[m] = 0);

    this.http.get<any[]>('http://localhost:3000/api/commandes/confirmed/stats').subscribe(data => {
      console.log('Données récupérées pour les commandes confirmées:', data); // Log pour vérifier les données

      data.forEach(item => {
        // Extraction du mois sous forme '2025-04'
        const monthString = item.mois;
        const [year, month] = monthString.split('-'); // Séparer l'année et le mois

        // Convertir le mois numérique en nom
        const monthName = this.getMonthLabels()[parseInt(month, 10) - 1]; // Convertir le mois (1 -> janvier, 2 -> février, etc.)

        console.log('Mois:', monthName, 'Nombre:', item.nombre); // Log pour vérifier la correspondance

        if (monthName && item.nombre) {
          this.confirmedCountByMonth[monthName] = Number(item.nombre);
        }
      });

      this.createConfirmedChart();
    });
  }


  createConfirmedChart() {
    const labels = this.getMonthLabels();
    const counts = labels.map(m => this.confirmedCountByMonth[m]);

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Commandes confirmées par mois',
          data: counts,
          backgroundColor: 'rgba(255, 159, 64, 0.4)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 50,
            ticks: {
              stepSize: 5
            }
          }
        }
      }
    };

    if (this.confirmedChart) this.confirmedChart.destroy();
    const ctx = document.getElementById('confirmedChart') as HTMLCanvasElement;
    this.confirmedChart = new Chart(ctx, config);
  }

  // 📅 RENDEZ-VOUS
  loadRendezvous() {
    const months = this.getMonthLabels();
    months.forEach(m => this.rendezvousByMonth[m] = 0);

    this.http.get<any[]>('http://localhost:3000/api/rendezvous/all').subscribe(data => {
      data.forEach(item => {
        const date = new Date(item.dateHeure);
        const key = date.toLocaleString('default', { month: 'long' });
        if (this.rendezvousByMonth[key] !== undefined) {
          this.rendezvousByMonth[key]++;
        }
      });

      this.createRendezvousChart();
    });
  }

  // 🧪 Créer graphique des tests
  createTestChart() {
    const labels = Object.keys(this.testCountsByMonth).sort();
    const counts = labels.map(mois => this.testCountsByMonth[mois]);

    const chartConfig: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Tests par mois',
          data: counts,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,   // Commence à 0
            max: 20,            // Fin à 200
            ticks: {
              stepSize: 2       // Intervalle de 20
            }
          }
        }
      }
    };

    if (this.testChart) this.testChart.destroy();
    const ctx = document.getElementById('testChart') as HTMLCanvasElement;
    this.testChart = new Chart(ctx, chartConfig);
  }

// 📅 Créer graphique des rendez-vous
  createRendezvousChart() {
    const labels = this.getMonthLabels();
    const counts = labels.map(m => this.rendezvousByMonth[m]);

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Rendez-vous par mois',
          data: counts,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,   // Commence à 0
            max: 20,            // Fin à 200
            ticks: {
              stepSize: 2       // Intervalle de 20
            }
          }
        }
      }
    };

    if (this.rendezvousChart) this.rendezvousChart.destroy();
    const ctx = document.getElementById('rendezvousChart') as HTMLCanvasElement;
    this.rendezvousChart = new Chart(ctx, config);
  }


  // 🔁 UTILS
  getMonthLabels(): string[] {
    return [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
  }
}
