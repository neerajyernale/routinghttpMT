import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthServiceService } from './auth.service';

describe('AuthServiceService', () => {
  let service: AuthServiceService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('stores and reads the token and user role', () => {
    service.setToken('token');
    service.setUserRole('buyer');

    expect(service.getToken()).toBe('token');
    expect(service.getUserRole()).toBe('buyer');
  });

  it('allows buyers to view products but not manage them', () => {
    service.saveSession('token', { userRole: 'buyer' });

    expect(service.canAddProduct()).toBeFalse();
    expect(service.canEditproduct()).toBeFalse();
    expect(service.canDeleteProduct()).toBeFalse();
  });

  it('allows admins to manage products', () => {
    service.saveSession('token', { userRole: 'Admin' });

    expect(service.canAddProduct()).toBeTrue();
    expect(service.canEditproduct()).toBeTrue();
    expect(service.canDeleteProduct()).toBeTrue();
  });

  it('allows superadmins to manage products regardless of role casing', () => {
    service.saveSession('token', { userRole: 'superAdmin' });

    expect(service.canAddProduct()).toBeTrue();
    expect(service.canEditproduct()).toBeTrue();
    expect(service.canDeleteProduct()).toBeTrue();
  });
});
