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
import {KitsComponent} from './pages/kits/kits.component';
import {PanierComponent} from './pages/panier/panier.component';
import {ResultatComponent} from './pages/admin/resultat/resultat.component';
import {RendezVousListComponent} from './pages/admin/rendez-vous-list/rendez-vous-list.component';
import {CommandeComponent} from './pages/admin/commande/commande.component';
import {DashAdminComponent} from './pages/admin/dash-admin/dash-admin.component';
import {ListUserComponent} from './pages/admin/list-user/list-user.component';
import {TestAdminComponent} from './pages/admin/test-admin/test-admin.component';
import {KitAdminComponent} from './pages/admin/kit-admin/kit-admin.component';
import {AproposComponent} from './siteVitrine/apropos/apropos.component';
import {ServiceComponent} from './siteVitrine/service/service.component';

export const routes: Routes = [
  {path:'' ,component: HomeComponent} ,
  { path: 'about', component: AproposComponent },
  { path: 'services', component: ServiceComponent },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: '', component: LayoutComponent, children: [
      { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' } },

      { path: 'profile', component: ProfileComponent , data: { title: 'Pofile' }},
      { path: 'resultats', component: ResultatsComponent, data: { title: 'Resultats' } },
      { path: 'rendez-vous', component: RendezVousComponent , data: { title: 'Rendez-vous' } },
    { path: 'test', component: TestComponent , data: { title: 'test' } },
    { path: 'kits', component: KitsComponent , data: { title: 'kits' } },
      { path: 'panier', component: PanierComponent , data: { title: 'panier' } },


      { path: 'admin/resultat', component: ResultatComponent},
      { path: 'admin/rendez-vous', component: RendezVousListComponent  },
      { path: 'admin/commande', component: CommandeComponent  },
      { path: 'admin/dashboard', component: DashAdminComponent },
      { path: 'admin/user', component: ListUserComponent },
      { path: 'admin/test', component: TestAdminComponent },
      { path: 'admin/kit', component: KitAdminComponent },



    ]
  }
];
