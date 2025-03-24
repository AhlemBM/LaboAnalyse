import { Routes } from '@angular/router';
import {HomeComponent} from './siteVitrine/home/home.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {LayoutComponent} from './components/layout/layout.component';
import {ResultatsComponent} from './pages/resultats/resultats.component';
import {RendezVousComponent} from './pages/rendez-vous/rendez-vous.component';
import {TestComponent} from './pages/test/test.component';

export const routes: Routes = [
  {path:'' ,component: HomeComponent} ,
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '', component: LayoutComponent, children: [
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },

      { path: 'profile', component: ProfileComponent , data: { title: 'Pofile' }},
      { path: 'resultats', component: ResultatsComponent, data: { title: 'Resultats' } },
      { path: 'rendez-vous', component: RendezVousComponent , data: { title: 'Rendez-vous' } },
    { path: 'test', component: TestComponent , data: { title: 'test' } },

    ]
  }
];
