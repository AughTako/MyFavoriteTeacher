import { Component, OnInit } from '@angular/core';
import { TeacherWrapper } from '../models/nastavnik';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit{

  first_name: String = '';
  last_name: String = '';
  subject: String = '';

  numberOfStudents: number = 0;
  numberOfTeachers: number = 0;
  engagedTeachers: TeacherWrapper[];
  sortBy: String = 'asc'

  constructor(private service: UnifiedService) {}
  ngOnInit(): void {
    this.getNumberOfStudents();
    this.getNumberOfTeachers();
    this.search();
  }

  getNumberOfStudents() {
    this.service.getNumberOfStudents()
    .subscribe((number: number)=>{
      if(number)
        this.numberOfStudents = number;
    })
  }
  getNumberOfTeachers() {
    this.service.getNumberOfTeachers()
    .subscribe((number: number)=>{
      if(number)
        this.numberOfTeachers = number;
    })
  }

  sortByName() {
    this.service.engagedTeachers('personalInfo.last_name', this.sortBy.toString(), '', '', '')
    .subscribe((teachers: TeacherWrapper[])=> {
      if(teachers) {
          this.engagedTeachers = teachers;
          console.log(this.engagedTeachers)
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
    this.service.engagedTeachers('personalInfo.last_name', this.sortBy.toString(), '', '', '')
    .subscribe((teachers: TeacherWrapper[])=> {
      if(teachers) {
          this.engagedTeachers = teachers;
          console.log(this.engagedTeachers)
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
    this.service.engagedTeachers('schoolInfo.subjects', this.sortBy.toString(), '', '', '')
    .subscribe((teachers: TeacherWrapper[])=> {
      if(teachers) {
          this.engagedTeachers = teachers;
          console.log(this.engagedTeachers)
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
    this.service.engagedTeachers('', '', this.first_name.toString(),
    this.last_name.toString(), this.subject.toString())
    .subscribe((teachers: TeacherWrapper[])=> {
      if(teachers) {
          this.engagedTeachers = teachers;
          console.log(this.engagedTeachers)
        }

    })
  }
}
