import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // ✅ corrigé ici
})
export class SidebarComponent implements OnInit {
  userRole: string = '';

  ngOnInit() {
    this.userRole = localStorage.getItem('role') || '';
    console.log('this role is ' + this.userRole);
  }
}
