import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://localhost:3000/api'; //

  constructor(private http: HttpClient) {}
  getProfile(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile/${id}`);
  }
}
