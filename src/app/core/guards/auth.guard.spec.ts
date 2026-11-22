import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthServiceService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  function createRoute(data: Record<string, string | string[]>): ActivatedRouteSnapshot {
    const route = new ActivatedRouteSnapshot();
    route.data = data;
    return route;
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('redirects unauthenticated users to login with the requested route', () => {
    const router = TestBed.inject(Router);

    const redirect = guard.canActivate(
      createRoute({}),
      { url: '/product/42/edit' } as RouterStateSnapshot
    ) as UrlTree;

    expect(router.serializeUrl(redirect)).toBe('/login?returnUrl=%2Fproduct%2F42%2Fedit');
  });

  it('allows recognized roles to open protected pages', () => {
    TestBed.inject(AuthServiceService).saveSession('token', { userRole: 'buyer' });

    expect(guard.canActivate(
      createRoute({ roles: ['buyer', 'Admin', 'SuperAdmin'] }),
      { url: '/fairs' } as RouterStateSnapshot
    )).toBeTrue();
  });

  it('redirects unauthenticated routes to the login screen', () => {
    const router = TestBed.inject(Router);
    const protectedRoute: Route = {
      path: 'product',
      data: { roles: ['buyer', 'Admin', 'SuperAdmin'] }
    };

    const protectedRedirect = guard.canMatch(protectedRoute) as UrlTree;
    const fallbackRedirect = guard.canMatch({ path: '**' }) as UrlTree;

    expect(router.serializeUrl(protectedRedirect)).toBe('/login');
    expect(router.serializeUrl(fallbackRedirect)).toBe('/login');
  });

  it('redirects users without an allowed role to login', () => {
    const router = TestBed.inject(Router);
    TestBed.inject(AuthServiceService).saveSession('token', { userRole: 'unknown' });

    const redirect = guard.canActivate(
      createRoute({ roles: ['buyer', 'Admin', 'SuperAdmin'] }),
      { url: '/user' } as RouterStateSnapshot
    ) as UrlTree;

    expect(router.serializeUrl(redirect)).toBe('/login');
  });

  it('returns buyers to products when they try to open product management routes', () => {
    const router = TestBed.inject(Router);
    TestBed.inject(AuthServiceService).saveSession('token', { userRole: 'buyer' });

    const redirect = guard.canActivate(
      createRoute({ roles: ['Admin', 'SuperAdmin'], unauthorizedRedirect: '/product' }),
      { url: '/product/add' } as RouterStateSnapshot
    ) as UrlTree;

    expect(router.serializeUrl(redirect)).toBe('/product');
  });
});
