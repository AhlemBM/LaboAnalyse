import { Component, OnDestroy, OnInit } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit, OnDestroy {
  socket!: Socket;
  messages: Message[] = [];
  notifications: string[] = [];
  selectedMessage: Message | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMessages();

    this.socket = io('http://localhost:3000');

    this.socket.on('connect', () => {
      console.log('Connecté à Socket.io');
    });

    this.socket.on('newMessageNotification', (data: Message) => {
      this.notifications.push(`Nouveau message de ${data.name}`);
      this.loadMessages();
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  loadMessages() {
    this.http.get<Message[]>('http://localhost:3000/api/admin/messages').subscribe({
      next: (res) => this.messages = res,
      error: (err) => console.error(err),
    });
  }

  readMessage(msg: Message) {
    this.http.get<Message>(`http://localhost:3000/api/admin/messages/${msg.id}`).subscribe({
      next: (data) => {
        // Marquer comme lu localement
        const index = this.messages.findIndex(m => m.id === msg.id);
        if (index !== -1) {
          this.messages[index].isRead = true;
        }

        // Retirer notification associée
        this.notifications = this.notifications.filter(n => !n.includes(msg.name));

        this.selectedMessage = data;
      },
      error: (err) => console.error('Erreur lors de la récupération du message', err)
    });
  }

  closeModal() {
    this.selectedMessage = null;
  }
}
