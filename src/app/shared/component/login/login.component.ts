
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { AuthServiceService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  isSignup = false;
  showPassword = false;
  loading = false;

  message = '';
  messageType: 'success' | 'error' = 'success';

  authForm: FormGroup;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.authForm = new FormGroup({

      fullName: new FormControl(''),

      email: new FormControl(
        '',
        [
          Validators.required,
          Validators.email
        ]
      ),

      password: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ),

      userRole: new FormControl('buyer'),

      remember: new FormControl(true),

      updates: new FormControl(false)

    });

  }

  // Switch between Login and Signup
  setMode(signup: boolean): void {

    this.isSignup = signup;
    this.message = '';
    this.messageType = 'success';
    this.showPassword = false;

    const nameControl = this.authForm.get('fullName');

    if (signup) {

      nameControl?.setValidators([
        Validators.required
      ]);

    } else {

      nameControl?.clearValidators();

    }

    nameControl?.updateValueAndValidity();

    this.authForm.markAsUntouched();

  }

  // Show or hide password
  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }

  // Submit form
  submit(): void {

    this.message = '';

    if (this.authForm.invalid) {

      this.authForm.markAllAsTouched();

      return;

    }

    if (this.loading) {
      return;
    }

    if (this.isSignup) {

      this.registerUser();

    } else {

      this.loginUser();

    }

  }

  // Login functionality
  loginUser(): void {

    const credentials = {

      email: this.authForm.value.email,

      password: this.authForm.value.password

    };

    this.loading = true;

    this.authService.login(credentials)
      .pipe(

        finalize(() => {

          this.loading = false;

        })

      )
      .subscribe({

        next: (response: any) => {

          console.log('Login response:', response);

          // Adjust these fields according to your backend response
          const token = response.token || response.accessToken;

          const user = response.user || {
            userRole: response.userRole || response.role
          };

          if (!token) {

            this.messageType = 'error';
            this.message =
              'Login successful, but authentication token was not returned.';

            return;

          }

          // Store token and user details
          this.authService.saveSession(token, user);

          this.messageType = 'success';
          this.message = 'Login successful!';

          // Navigate after successful login
          const fallbackReturnUrl = this.route.snapshot.routeConfig?.path === '**'
            ? this.router.url
            : null;
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || fallbackReturnUrl;
          const destination = returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')
            ? returnUrl
            : '/product';
          this.router.navigateByUrl(destination);

        },

        error: (error) => {

          console.error('Login error:', error);

          this.messageType = 'error';
          this.message =
            error.error?.message ||
            'Invalid email or password. Please try again.';

        }

      });

  }

  // Signup functionality
  registerUser(): void {

    const signupData = {

      name: this.authForm.value.fullName,

      email: this.authForm.value.email,

      password: this.authForm.value.password,

      userRole: this.authForm.value.userRole || 'buyer'

    };

    this.loading = true;

    this.authService.signUp(signupData)
      .pipe(

        finalize(() => {

          this.loading = false;

        })

      )
      .subscribe({

        next: (response: any) => {

          console.log('Signup response:', response);

          this.messageType = 'success';
          this.message = 'Account created successfully! Please login.';

          this.setMode(false);

          this.authForm.patchValue({

            email: signupData.email,

            password: ''

          });

          this.message = 'Account created successfully! Please login.';

        },

        error: (error) => {

          console.error('Signup error:', error);

          this.messageType = 'error';
          this.message =
            error.error?.message ||
            'Unable to create account. Please try again.';

        }

      });

  }

}
