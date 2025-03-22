import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';

import {CommonModule} from '@angular/common';
import {LoginComponent} from './pages/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule ,RouterOutlet  , CommonModule ,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontEnd';
}
