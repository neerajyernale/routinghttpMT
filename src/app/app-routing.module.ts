import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/component/home/home.component';
import { UserComponent } from './shared/component/user/user.component';
import { FairsComponent } from './shared/component/fairs/fairs.component';
import { ProductComponent } from './shared/component/product/product.component';
import { ProductFormComponent } from './shared/component/product-form/product-form.component';
import { SingleproductComponent } from './shared/component/singleproduct/singleproduct.component';
import { LoginComponent } from './shared/component/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CanDeactivateGuard } from './core/guards/can-deactivate.guard';

const routes: Routes = [

  // Public route
  {
    path: 'login',
    component: LoginComponent
  },

  // Protected home route
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canMatch: [AuthGuard],
    canActivate: [AuthGuard],
    data: { roles: ['buyer', 'Admin', 'SuperAdmin'] }
  },

  {
    path: 'home',
    component: HomeComponent,
    canMatch: [AuthGuard],
    canActivate: [AuthGuard],
    data: { roles: ['buyer', 'Admin', 'SuperAdmin'] }
  },

  {
    path: 'user',
    component: UserComponent,
    canMatch: [AuthGuard],
    canActivate: [AuthGuard],
    data: { roles: ['buyer', 'Admin', 'SuperAdmin'] }
  },

  {
    path: 'fairs',
    component: FairsComponent,
    canMatch: [AuthGuard],
    canActivate: [AuthGuard],
    data: { roles: ['buyer', 'Admin', 'SuperAdmin'] }
  },

  // Product parent and child routes
  {
    path: 'product',
    component: ProductComponent,
    canMatch: [AuthGuard],
    canActivate: [AuthGuard],
    data: { roles: ['buyer', 'Admin', 'SuperAdmin'] },

    children: [

      {
        path: 'add',
        component: ProductFormComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
        data: { roles: ['Admin', 'SuperAdmin'], unauthorizedRedirect: '/product' }
      },

      {
        path: ':id/edit',
        component: ProductFormComponent,
        canActivate: [AuthGuard],
        canDeactivate: [CanDeactivateGuard],
        data: { roles: ['Admin', 'SuperAdmin'], unauthorizedRedirect: '/product' }
      },

      {
        path: ':id',
        component: SingleproductComponent
      }

    ]
  },

  // Show the login screen at the requested URL until the user is authenticated.
  {
    path: '**',
    component: LoginComponent,
    canMatch: [AuthGuard]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],

  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
