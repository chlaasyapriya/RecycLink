import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http:HttpClient) { }

  getNotificationsByUserId(userId: number){
    return this.http.get(`https://localhost:7243/api/Notification/${userId}`);
  }
}
