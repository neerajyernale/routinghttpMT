
import { Injectable } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = this.authService.getToken();
    const isAuthApiRequest = req.url.startsWith(environment.auth_url);

    // Attach JWT token if available
    let authReq = req;

    if (token && isAuthApiRequest) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        // Handle expired or invalid authentication
        if (error.status === 401 && isAuthApiRequest) {

          const isLoginRequest =
            req.url.includes('/api/auth/login');

          const isSignupRequest =
            req.url.includes('/api/auth/register');

          // Do not redirect for login/signup errors
          if (!isLoginRequest && !isSignupRequest) {

            this.authService.logOut();

            this.router.navigate(['/login']);

          }

        }

        // 403 means authenticated but not authorized
        if (error.status === 403) {
          console.error('Access denied: Insufficient permissions.');
        }

        return throwError(() => error);

      })

    );

  }

}
