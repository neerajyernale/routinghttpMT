import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) { }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  signOut(): void {
    const currentUrl = this.router.url;
    this.authService.logOut();
    this.router.navigateByUrl(currentUrl);
  }

}
