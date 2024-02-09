import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassRequest } from '../models/class_requests';
import { TeacherWrapper } from '../models/nastavnik';
import { User } from '../models/user';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private service: UnifiedService,
    private router: Router) { }
  teacher: TeacherWrapper = null;
  user: User = null;
  avatarUrl: String = '';
  doubleClass: boolean = false;

  classes: ClassRequest[] = [];
  student: User = null;
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'))
    if (!this.user) {
      this.router.navigate(['login']);
    }
    else if (this.user.type == 'Ucenik') {
      this.route.params.subscribe((params) => {
        this.service.getTeacher(params['username'])
          .subscribe((teacher_: TeacherWrapper) => {
            if (teacher_) {
              this.teacher = teacher_;
              this.avatarUrl = this.teacher.personalInfo.avatar;
              this.displayAvatar();
            }
          })
      })
    }
    else if (this.user.type == 'Nastavnik') {
      this.route.params.subscribe((params) => {
        this.service.getStudentByClasses(params['username'],this.user.username)
          .subscribe((response: ClassRequest[]) => {
            if (response) {
              this.classes = response
            }
          })
        this.service.getStudentInfo(params['username'])
          .subscribe((student: User) => {
            this.student = student;
          })
      })
    }
  }

  selectedClass: String = '';
  topicOfClass: String = '';
  dateOfClass: String = '';

  displayAvatar() {
  
    this.avatarUrl = this.service.getImgUrl(this.user.personalInfo.avatar.toString().replace('uploads\\images\\', ''));
  }

  reserveClass() {
    console.log(this.dateOfClass)
    // if(new Date(this.dateOfClass as string) < new Date()){
    //   alert('Ne mozete da zakazujete u proslosti!')
    //   return;
    // }
    this.service.sendClassRequest(this.teacher.username, this.user.username, this.user.personalInfo.first_name, this.user.personalInfo.last_name,
      this.selectedClass, this.dateOfClass, this.topicOfClass, this.doubleClass)
      .subscribe((ok: any) => {
        if (ok) {
          alert(ok.message)

        }
      })
  }
}