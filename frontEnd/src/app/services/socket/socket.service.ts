// src/app/services/socket/socket.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;

  constructor() {
    // Connecte au serveur Socket.io (change l'URL si besoin)
    this.socket = io('http://localhost:3000');
  }

  // Écoute les notifications de nouveaux messages non lus
  listenForNewMessages(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('newMessageNotification', (data) => {
        subscriber.next(data);
      });

      // Nettoyage à la désinscription
      return () => {
        this.socket.off('newMessageNotification');
      };
    });
  }

  // Optionnel : fonction pour émettre des événements au serveur
  emitEvent(eventName: string, data?: any) {
    this.socket.emit(eventName, data);
  }
}
