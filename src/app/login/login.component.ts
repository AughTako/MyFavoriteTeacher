import { Component } from '@angular/core';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private service: UnifiedService) {}

  username: String;
  password: String;

  login() {

  }
}
