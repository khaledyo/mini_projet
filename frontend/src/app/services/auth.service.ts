import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  http=inject(HttpClient);
  private logoutTimer: any;
  sendEmail(email: String): Observable<any> {
    return this.http.post(this.apiUrl+'/auth/send-email', {email});
  }
  resetPassword(reset: any): Observable<any> {
    return this.http.post(this.apiUrl+'/auth/reset-password', reset);
  }
  reset(password: string): Observable<any> {
    return this.http.put(this.apiUrl + '/auth/reset', { password });
  }
  
  login(email: string,password:string): Observable<any> {
    return this.http.post<{ token: string; user: any }>(this.apiUrl+'/auth/login', {email,password}).pipe(
      tap((response) => {
        this.setSession(response.token, response.user);
      })
    );
  }

  private setSession(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    const expirationTime = this.getTokenExpirationTime(token);
    if (expirationTime) {
      const expiresIn = expirationTime - Date.now();
      this.startLogoutTimer(expiresIn);
    }
  }

  private getTokenExpirationTime(token: string): number | null {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000;
    } catch {
      return null;
    }
  }

  private startLogoutTimer(expiresIn: number) {
    clearTimeout(this.logoutTimer);
    this.logoutTimer = setTimeout(() => this.logout(), expiresIn);
  }
  
  get LoginIn() {
    const token = localStorage.getItem('token');
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const expirationTime = this.getTokenExpirationTime(token);
    return expirationTime ? Date.now() > expirationTime : true;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    clearTimeout(this.logoutTimer);
  }
 
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  get userName() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).name : null;
  }

  get userEmail() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).email : null;
  }
  get username() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData).username : null;
  }
}


