import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  constructor(private service: UnifiedService, private router: Router) {}

  username: String = '';
  password: String = '';
  user: User;
  message: String = '';

  ngOnInit(): void {
      this.message = ''
      this.user = null;
      localStorage.removeItem('user');
  }

  login() {
    if(this.username == '' || this.password =='') {
      this.message = 'Prazna polja';
      return;
    }
    this.service.login(this.username, this.password)
    .subscribe((user: User) => {
      console.log(user);
      if(user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate([user.type.toLowerCase()]);
      }
      else {
        this.message = 'Pogresna lozinka ili username';
      }
    })
  }
}
