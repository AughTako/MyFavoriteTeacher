import { Component } from '@angular/core';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
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
  cvPath : String = '';
  school_type: String = '';
  school_year: Number = 0;
  subjects: String[] = [];
  ageGroups: String[] = [];
  sourceOfInformation: String = '';

  /*
    TODO Relative path
    File names shouldnt be static like:
    C:\\Users\\Nazgul\\Desktop\\Project\\backend\\uploads\\pdfs\\
    but instead just a relative path to the file
   */
  
  /*
    TODO Limit size
    Limit the size of profile pic and pdf
  */
  /*
    TODO Regex
    Password regex
  */

  message: String = '';
  constructor(private service: UnifiedService) {}

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
    if (this.avatarPath) {
        if (this.type === 'Nastavnik' && this.cvPath) {
            this.service.register(this.username, this.password, this.type,
              this.sec_question, this.sec_answer, this.first_name,
              this.last_name, this.gender, this.address, this.phone, this.email,
              this.avatarPath, this.cvPath, this.school_type, this.school_year,
              this.subjects, this.ageGroups, this.sourceOfInformation)
              .subscribe((msg: any) => {
                this.message = msg.message;
                console.log(this.message);
            });
        } else {
          this.service.register(this.username, this.password, this.type,
            this.sec_question, this.sec_answer, this.first_name,
            this.last_name, this.gender, this.address, this.phone, this.email,
            this.avatarPath, '', this.school_type, this.school_year,
            [], [], '')
            .subscribe((msg: any) => {
              this.message = msg.message;
              console.log(this.message);
          });
        }
    } else {
      console.error('Avatar is missing.');
    }
  }

  showTeacherFields: boolean = false;
  switchNumbers: boolean = false;

  checkSchoolType(){
    if(this.school_type !== 'osnovna')
      this.switchNumbers = true;
    else {
      this.switchNumbers = false;
    }
  }

  onUserTypeChange() {
      this.showTeacherFields = this.type === 'Nastavnik';
  }
}
