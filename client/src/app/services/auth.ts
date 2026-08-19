import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  private apiUrl = this.isLocal ? 'http://localhost:5001/api/auth' : 'https://andromeda-server.vercel.app/api/auth';
  private tokenKey = 'token';
  
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.loggedInSubject.asObservable();

  constructor() {}

  private hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.loggedInSubject.next(true);
        }
      })
    );
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this.loggedInSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me?t=${new Date().getTime()}`);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }

  updateUser(userId: string, data: any): Observable<any> {
    const userApiUrl = this.isLocal ? 'http://localhost:5001/api/users' : 'https://andromeda-server.vercel.app/api/users';
    return this.http.put(`${userApiUrl}/${userId}`, data);
  }

  deleteUser(userId: string): Observable<any> {
    const userApiUrl = this.isLocal ? 'http://localhost:5001/api/users' : 'https://andromeda-server.vercel.app/api/users';
    return this.http.delete(`${userApiUrl}/${userId}`);
  }
}
