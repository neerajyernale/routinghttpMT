
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanMatch,
  ActivatedRouteSnapshot,
  Route,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';

import { AuthServiceService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanMatch {
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  canMatch(route: Route): boolean | UrlTree {
    const token = this.authService.getToken();

    if (route.path === '**') {
      return this.router.createUrlTree([token ? '/home' : '/login']);
    }

    if (!token) {
      return this.router.createUrlTree(['/login']);
    }

    const requiredRoles = route.data?.['roles'] as string[] | undefined;
    if (requiredRoles && !this.authService.hasRole(requiredRoles)) {
      const redirect = route.data?.['unauthorizedRedirect'] as string | undefined;
      return this.router.createUrlTree([redirect || '/login']);
    }

    return true;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (!this.authService.getToken()) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    const requiredRoles = route.data['roles'] as string[] | undefined;
    if (requiredRoles && !this.authService.hasRole(requiredRoles)) {
      const unauthorizedRedirect = route.data['unauthorizedRedirect'] as string | undefined;
      return this.router.createUrlTree([unauthorizedRedirect || '/login']);
    }

    return true;
  }
}
