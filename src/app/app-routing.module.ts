import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminComponent } from './admin/admin.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './login/login.component';
import { NastavnikComponent } from './nastavnik/nastavnik.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UcenikComponent } from './ucenik/ucenik.component';

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'admin-login', component: AdminLoginComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'ucenik', component: UcenikComponent},
  {path: 'nastavnik', component: NastavnikComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
