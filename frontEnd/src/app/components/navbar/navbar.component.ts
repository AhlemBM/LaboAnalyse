import { Component } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  pageTitle: string = ''; // Déclarez la propriété pageTitle

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
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
