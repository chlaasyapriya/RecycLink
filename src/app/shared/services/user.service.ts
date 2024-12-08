import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseurl = `https://localhost:7243/api/User`;

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseurl}/${userId}`);
  }

  getAllUsers(){
    return this.http.get(`${this.baseurl}/allUsers`);
  }
}
