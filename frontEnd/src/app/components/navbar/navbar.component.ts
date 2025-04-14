import { Component } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [  CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  pageTitle: string = ''; // Déclarez la propriété pageTitle
  userRole: string = 'admin'; // à remplacer par une vraie valeur récupérée via auth service


  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role') || '';
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd) // Capture every navigation end event
    ).subscribe(() => {
      const currentRoute = this.activatedRoute.firstChild;
      if (currentRoute) {
        // Dynamically set the title based on route
        currentRoute.data.subscribe((data: any) => {
          this.pageTitle = data.title || 'Default Title'; // Use route data if available
        });
      }
    });
  }

}
