import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'routinghttpMT';

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) { }

  get showNavBar(): boolean {
    const currentPath = this.router.url.split('?')[0];
    return currentPath !== '/login' &&
      this.authService.isLoggedIn() &&
      this.authService.hasRole(['buyer', 'Admin', 'SuperAdmin']);
  }
}
