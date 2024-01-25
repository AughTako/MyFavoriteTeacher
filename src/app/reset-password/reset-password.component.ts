import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
  cantRememberOld: boolean = false;
  old_password: String = '';
  new_password: String = '';
  new_password_repeated: String = '';
  username: String;
  user: User;

  seq_question: String;
  seq_answer: String;
  seq_answer_back: String;

  message: String = '';

  foundUser: boolean = false;
  answeredCorrect: boolean = false;



  constructor(private service: UnifiedService) {}

  ngOnInit(): void {
    this.message = '';
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user)
  }

  findUser() {
    if(this.username == '') {
      this.message = 'Niste uneli korisnicko ime'
      return;
    }
    
    this.service.findUser(this.username)
    .subscribe((message: any)=> {
      if(message) {
        if(message) {
          if(message.message == 'Nije pronadjen') {
            this.message = message.message;
          }
          else {
            this.foundUser = true;
            this.seq_question = message.seq_question;
            this.seq_answer_back = message.seq_answer;
            this.message = '';
          }
        }
      }
    })
  }

  answerQuestion() {
    if(this.seq_answer === this.seq_answer_back) {
      this.answeredCorrect = true;
      return;
    }
    else {
      this.answeredCorrect = false;
      return;
    }
  }

  changePassword() {
    if(!this.cantRememberOld && (this.old_password == '' || this.new_password == '')) {
      this.message = 'Niste uneli jedno od polja'
      return;
    }
    if(this.cantRememberOld && ((this.new_password != this.new_password_repeated) ||
      (this.new_password == '' || this.new_password_repeated == ''))) {
      this.message = 'Lozinke nisu identicne, proverite ih';
      return;
    }
    if(this.cantRememberOld) {
      this.service.changePassword(this.new_password, this.old_password, this.username, this.answeredCorrect)
      .subscribe((message: any)=> {
        this.message = message.message;
      });
    }
    else {
      this.service.changePassword(this.new_password, this.old_password, this.user.username, this.answeredCorrect)
      .subscribe((message: any)=> {
        this.message = message.message;
      });
    }
  }

  changeVariation() {
    if(this.cantRememberOld) {
      this.cantRememberOld = false;
    }
    else {
      this.cantRememberOld = true;
    }
  }


}
