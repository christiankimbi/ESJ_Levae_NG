import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../services/token.service';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private readonly baseUrl = '/api/auth';

  login(payload: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, payload).pipe(
      tap(response => this.tokenService.set(response.token))
    );
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigateByUrl('/auth/login');
  }

  isLoggedIn(): boolean {
    return this.tokenService.isAuthenticated();
  }
}
