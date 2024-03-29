import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherWrapper } from '../models/nastavnik';
import { User } from '../models/user';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-ucenik',
  templateUrl: './ucenik.component.html',
  styleUrls: ['./ucenik.component.css']
})
export class UcenikComponent implements OnInit{
  user: User;
  avatarUrl: string = '';
  changeInfo: boolean = false;
  message: String = '';

  first_name_search: String = '';
  last_name_search: String = '';
  subjects_search: String = '';
  sortBy: String = 'asc';

  first_name: String = '';
  last_name: String = '';
  email: String = '';
  phone: String = '';
  address: String = '';
  school_type: String = '';
  currectGrade: number = 0;

  teachers: any[] = [];
  switchNumbers: any;

  constructor(private service: UnifiedService, private router: Router) {}
  
  ngOnInit(): void {
      this.user= JSON.parse(localStorage.getItem('user'));
      if(!this.user)
        this.router.navigate(['login']);
      else {
        this.displayAvatar();
        this.getTeachersForGrade();
      }
  }

  isSrednja(): boolean {
    const regex = /^srednja.*/;
    return regex.test(this.user.schoolInfo.school_type.toLowerCase());
  }

  checkSchoolType(){
    // this.school_type = this.user.schoolInfo.school_type;
    console.log(this.school_type);
    if(this.school_type !== 'osnovna')
      this.switchNumbers = true;
    else {
      this.switchNumbers = false;
    }
    console.log(this.switchNumbers)
  }

  displayAvatar() {
    console.log(this.user.personalInfo.avatar.toString().replace('uploads\\images\\', ''));
    this.avatarUrl = this.service.getImgUrl(this.user.personalInfo.avatar.toString().replace('uploads\\images\\', ''));
  }
  changeInfoToggle() {

    if(this.changeInfo == false)
      this.changeInfo = true;
    else
      this.changeInfo = false;
  }
  avatarPath: String = ''

  onAvatarChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.service.uploadImage(file).subscribe((response: any) => {
        this.avatarPath = response.imagePath;
        console.log(this.avatarPath);
      });
    }
  }

  changeInformation() {

    this.service.changeInfo(
      this.user.username,
      this.first_name,
      this.last_name,
      this.email,
      this.phone,
      this.address,
      this.school_type,
      this.currectGrade,
      this.avatarPath
      ).subscribe((info: any) => {
        if(info) {
          this.user = info.user;
          console.log(this.user)
          localStorage.setItem('user', JSON.stringify(this.user));
          this.message = info.message;
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      })
  }

  getTeachersForGrade() {
    this.service.getTeachersForGrade(this.user.schoolInfo.school_type.split(' ')[0], this.user.schoolInfo.currentGrade)
    .subscribe((teachers: TeacherWrapper[]) => {
      if(teachers) {
        this.teachers = teachers;
        console.log('------------')
        console.log(this.teachers);
        console.log('------------')
      }
    })
  }

  sortByName() {
    this.service.filterTeachers(this.user.schoolInfo.school_type.split(' ')[0], this.user.schoolInfo.currentGrade, '',
    '', '', 'personalInfo.first_name', this.sortBy)
    .subscribe((teachers: TeacherWrapper[])=> {
      if(teachers) {
          this.teachers = teachers;
          console.log(this.teachers)
        }

    })
    if(this.sortBy === 'asc') {
      this.sortBy = 'desc'
    }
    else {
      this.sortBy = 'asc'
    }
  }


  sortByLastName() {
    this.service.filterTeachers(this.user.schoolInfo.school_type.split(' ')[0], this.user.schoolInfo.currentGrade, '',
    '', '', 'personalInfo.last_name', this.sortBy)
    .subscribe((teachers: TeacherWrapper[])=> {
      if(teachers) {
          this.teachers = teachers;
          console.log(this.teachers)
        }

    })
    if(this.sortBy === 'asc') {
      this.sortBy = 'desc'
    }
    else {
      this.sortBy = 'asc'
    }
  }


  sortBySubjects() {
    this.service.filterTeachers(this.user.schoolInfo.school_type.split(' ')[0], this.user.schoolInfo.currentGrade, '',
    '', '', 'schoolInfo.subjects', this.sortBy)
    .subscribe((teachers: TeacherWrapper[])=> {
      if(teachers) {
          this.teachers = teachers;
          console.log(this.teachers)
        }

    })
    if(this.sortBy === 'asc') {
      this.sortBy = 'desc'
    }
    else {
      this.sortBy = 'asc'
    }
  }

  search() {
    this.service.filterTeachers(this.user.schoolInfo.school_type.split(' ')[0], this.user.schoolInfo.currentGrade, this.first_name_search.toString(),
    this.last_name_search.toString(), this.subjects_search.toString(), '', '')
    .subscribe((teachers: TeacherWrapper[])=> {
      if(teachers) {
          this.teachers = teachers;
          console.log(this.teachers)
        }

    })
  }
}
