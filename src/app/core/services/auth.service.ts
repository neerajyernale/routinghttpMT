import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginRequest } from '../../shared/model/authModel';
import { SignupRequest } from '../../shared/model/signup.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private authUrl = environment.auth_url;
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';
  private readonly roleKey = 'auth_user_role';

  constructor(private http: HttpClient) {}

  signUp(details: SignupRequest): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/api/auth/register`, details);
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/api/auth/login`, credentials);
  }

  saveSession(token: string, user: any): void {
    this.setToken(token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    const role = this.readUserRole(user);
    if (role) {
      this.setUserRole(role);
    } else {
      localStorage.removeItem(this.roleKey);
    }
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    const savedUser = localStorage.getItem(this.userKey);
    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logOut(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.roleKey);
  }

  setUserRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }

  getUserRole(): string | null {
    const savedRole = localStorage.getItem(this.roleKey);
    if (savedRole) return savedRole;

    const user = this.getUser();
    return this.readUserRole(user);
  }

  private readUserRole(user: any): string | null {
    if (typeof user === 'string') {
      const value = user.trim();
      try {
        return this.readUserRole(JSON.parse(value));
      } catch {
        return value || null;
      }
    }

    if (!user) return null;
    if (Array.isArray(user.roles) && user.roles.length) return user.roles[0];
    return user.userRole || user.role || user.authority || null;
  }

  hasRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;

    const normalize = (role: string): string =>
      role.toLowerCase().trim().replace(/^role[_-]/, '').replace(/[_-\s]/g, '');

    return roles.some(role => normalize(role) === normalize(userRole));
  }

  canAddProduct(): boolean {
    return this.hasRole(['Admin', 'SuperAdmin']);
  }

  canEditproduct(): boolean {
    return this.hasRole(['Admin', 'SuperAdmin']);
  }

  canDeleteProduct(): boolean {
    return this.hasRole(['Admin', 'SuperAdmin']);
  }
}
