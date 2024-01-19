import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Admin } from '../models/admin';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  constructor(private service: UnifiedService, private router: Router) {}
  username: String;
  password: String;

  login() {
    this.service.login_admin(this.username, this.password)
    .subscribe((admin: Admin) => {
      if(admin)
        this.router.navigate(['admin']);
    })
  }
}
