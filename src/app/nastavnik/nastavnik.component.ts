import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClassRequest } from '../models/class_requests';
import { User } from '../models/user';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-nastavnik',
  templateUrl: './nastavnik.component.html',
  styleUrls: ['./nastavnik.component.css']
})
export class NastavnikComponent {
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
  avatarPath: String = '';

  teachers: any[] = [];

  classRequests: ClassRequest[] = [];
  acceptedRequests: ClassRequest[] = [];
  myStudents: User[] = [];

  constructor(private service: UnifiedService, private router: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    if (!this.user)
      this.router.navigate(['login']);
    else {
      this.getClassRequests();
      this.getStudents()
      this.getAcceptedRequests();
      this.displayAvatar();
    }
  }

  changeInfoToggle() {
    if (this.changeInfo == false)
      this.changeInfo = true;
    else
      this.changeInfo = false;
  }

  displayAvatar() {
    this.avatarUrl = this.service.getImgUrl(this.user.personalInfo.avatar.toString().replace('uploads\\images\\', ''));
    console.log(this.avatarUrl)
  }



  onAvatarChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.service.uploadImage(file).subscribe((response: any) => {
        this.avatarPath = response.imagePath;
        console.log(this.avatarPath);
      });
    }
  }

  getClassRequests() {
    this.service.getClassRequests(this.user.username)
      .subscribe((requests: ClassRequest[]) => {
        if (requests) {
          console.log(requests);
          this.classRequests = requests;

          this.classRequests.forEach(element => {
            // Create a new property for the formatted date string
            element.classInfo.formattedDateStart = new Date(element.classInfo.dateStart).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            element.classInfo.formattedDateEnd = new Date(element.classInfo.dateEnd).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          });
        }
      });
  }

  getAcceptedRequests() {
    this.service.getAcceptedRequests(this.user.username)
      .subscribe((accepted: ClassRequest[]) => {
        if (accepted) {
          this.acceptedRequests = accepted
          this.acceptedRequests.forEach(element => {
            element.classInfo.formattedDateStart = new Date(element.classInfo.dateStart).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            element.classInfo.formattedDateEnd = new Date(element.classInfo.dateEnd).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          })
        }

      })
  }
  acceptClass(id: String) {
    this.service.acceptClassRequest(id)
      .subscribe((message) => {
        if (message) {
          alert('Uspesno prihvacen cas!')
          setTimeout(() => {
            location.reload();
          }, 1000);
        }
      })
  }

  declineClass(id: String) {

  }

  getStudents() {
    this.service.getStudents(this.user.username)
    .subscribe((students: User[]) => {
      if(students)
        this.myStudents = students;
    })
  }

  changeInformation() {
    this.service.changeInfo(
      this.user.username,
      this.first_name,
      this.last_name,
      this.email,
      this.phone,
      this.address,
      '',
      0,
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
}
