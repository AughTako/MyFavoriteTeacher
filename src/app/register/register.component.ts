import { Component, OnInit } from '@angular/core';
import { CustomSubject } from '../models/subject';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  username: String = '';
  password: String = '';
  type: String = '';
  sec_question: String = '';
  sec_answer: String = '';
  first_name: String = '';
  last_name: String = '';
  gender: String = '';
  address: String = '';
  phone: String = '';
  email: String = '';
  avatar: File = null;
  CV: File = null;
  avatarPath: String = '';
  cvPath: String = '';
  school_type: String = '';
  school_year: Number = 0;
  subjects: String[] = [];
  otherSubject: String = '';
  ageGroups: String[] = [];
  sourceOfInformation: String = '';
  customSubjects: CustomSubject[] = [];

  ngOnInit(): void {
      this.service.getAllSubjects().subscribe((subjects: CustomSubject[]) => {
        if(subjects) {
          this.customSubjects = subjects;
        }
      })
  }

  message: String = '';
  constructor(private service: UnifiedService) { }

  onAvatarChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.service.uploadImage(file).subscribe((response: any) => {
        this.avatarPath = response.imagePath;
      });
    }
  }

  onCVChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.service.uploadPDF(file).subscribe((response: any) => {
        this.cvPath = response.pdfPath;

      });
    }
  }

  register() {
    console.log('Usao u reg')
    if (
      !this.username ||
      !this.password ||
      !this.sec_question ||
      !this.sec_answer ||
      !this.first_name ||
      !this.last_name ||
      !this.gender ||
      !this.address ||
      !this.phone ||
      !this.email ||
      (this.type === 'Nastavnik' && !this.cvPath) ||
      (this.type !== 'Nastavnik' && !this.school_type) ||
      (this.type !== 'Nastavnik' && !this.school_year) ||
      (this.type === 'Nastavnik' && !this.subjects.length) ||
      (this.type === 'Nastavnik' && !this.ageGroups.length)
    ) {
      this.message = 'Proverite da li ste popunili sva polja.';
      console.error(this.message);
      return;
    }
    const passwordRegex = /^(?=[a-zA-Z])(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){3,})(?=(?:.*\d){1,})(?=(?:.*[\W_]){1,})[a-zA-Z\d\W_]{6,10}$/;

    // Check if the password matches the criteria
    if (!passwordRegex.test(this.password as string)) {
      this.message = 'Lozinka ne ispunjava kriterijum.';
      console.error(this.message);
      return; // Stop the registration process
    }

    if (this.type === 'Nastavnik' && this.cvPath) {
      this.otherSubject != '' ? this.subjects.push(this.otherSubject) : this.otherSubject = '';
      this.service.register(this.username, this.password, this.type,
        this.sec_question, this.sec_answer, this.first_name,
        this.last_name, this.gender, this.address, this.phone, this.email,
        this.avatarPath ? this.avatarPath : '\\uploads\\images\\default.png', this.cvPath, this.school_type, this.school_year,
        this.subjects, this.ageGroups, this.sourceOfInformation)
        .subscribe((msg: any) => {
          this.message = msg.message;
          console.log(this.message);
        });
    } else {
      this.service.register(this.username, this.password, this.type,
        this.sec_question, this.sec_answer, this.first_name,
        this.last_name, this.gender, this.address, this.phone, this.email,
        this.avatarPath ? this.avatarPath : '\\uploads\\images\\default.png', '', this.school_type, this.school_year,
        [], [], '')
        .subscribe((msg: any) => {
          this.message = msg.message;
          console.log(this.message);
        });
    }

  }

  showTeacherFields: boolean = false;
  switchNumbers: boolean = false;

  checkSchoolType() {
    if (this.school_type !== 'osnovna')
      this.switchNumbers = true;
    else {
      this.switchNumbers = false;
    }
  }

  onUserTypeChange() {
    this.showTeacherFields = this.type === 'Nastavnik';
  }
}
