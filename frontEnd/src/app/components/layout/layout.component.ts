import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {FooterComponent} from '../footer/footer.component';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {NavbarComponent} from '../navbar/navbar.component';
import {LoginComponent} from '../../pages/login/login.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule , CommonModule ,RouterOutlet,FooterComponent,SidebarComponent,NavbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
