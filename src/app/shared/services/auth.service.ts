import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl="https://localhost:7243/api/User";
  private jwtHelper = new JwtHelperService();

  private loggedInSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  loggedIn$=this.loggedInSubject.asObservable();

  private _token: string | null = null;
  private _userId: number | null = null;

  constructor(private http: HttpClient) { }
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userData);
  }

  login(loginDetails: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/login`,loginDetails)
    .pipe(
      tap((response)=>{
        if(response && response.$values){
          this.setAuthData(response.$values[0],response.$values[1]);
          this.loggedInSubject.next(true);
        }
      })
    );
  }

  setAuthData(token: string, userId: string): void {
    this._token = token;
    this._userId = Number(userId);
    localStorage.setItem('token', token);  
    localStorage.setItem('userId', userId);  
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken?.role || null;
  }

  getToken(): string | null {
    return this._token || localStorage.getItem('token');
  }

  getUserId(): number | null {
    return this._userId || Number(localStorage.getItem('userId'));
  }

  clearAuthData(): void {
    this._token = null;
    this._userId = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.loggedInSubject.next(false);
  }

}
