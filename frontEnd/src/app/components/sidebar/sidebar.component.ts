import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import {SocketService} from '../../services/socket/socket.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'] // ✅ corrigé ici
})
export class SidebarComponent implements OnInit {
  userRole: string = '';
  unreadCount: number = 0;

  constructor(private socketService: SocketService, private http: HttpClient) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('role') || '';
    console.log('this role is ' + this.userRole);
    // Initial fetch du nombre de messages non lus
    this.getUnreadMessages();

    // Écouter les notifications en temps réel
    this.socketService.listenForNewMessages().subscribe((data: any) => {
      this.unreadCount = data.unreadCount;
    });
  }
  getUnreadMessages() {
    this.http.get<any>('http://localhost:3000/api/messages/unread-count').subscribe(
      (res) => {
        this.unreadCount = res.count;
      }
    );
  }
}
