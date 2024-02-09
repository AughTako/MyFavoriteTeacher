import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DetailsComponent } from './details/details.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { NastavnikComponent } from './nastavnik/nastavnik.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UcenikComponent } from './ucenik/ucenik.component';



  @NgModule({
    declarations: [
      AppComponent,
      LoginComponent,
      RegisterComponent,
      AdminComponent,
      AdminLoginComponent,
      ResetPasswordComponent,
      UcenikComponent,
      NastavnikComponent,
      IndexComponent,
      DetailsComponent
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      HttpClientModule,
      CommonModule,
      CanvasJSAngularChartsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule {
  };

