import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserComponent } from './shared/component/user/user.component';
import { HomeComponent } from './shared/component/home/home.component';
import { FairsComponent } from './shared/component/fairs/fairs.component';
import { ProductComponent } from './shared/component/product/product.component';
import { SingleproductComponent } from './shared/component/singleproduct/singleproduct.component';
import { ProductFormComponent } from './shared/component/product-form/product-form.component';
import { NavBarComponent } from './shared/component/nav-bar/nav-bar.component';
import { GetConformComponent } from './shared/component/get-conform/get-conform.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { LoaderComponent } from './shared/component/loader/loader.component';
import { LoginComponent } from './shared/component/login/login.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    HomeComponent,
    FairsComponent,
    ProductComponent,
    SingleproductComponent,
    ProductFormComponent,
    NavBarComponent,
    GetConformComponent,
    LoaderComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
