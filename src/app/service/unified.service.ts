import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnifiedService {

  uri: String = 'http://localhost:4000';
  constructor(private http: HttpClient) { }

  createFormData(data: Record<string, any>): FormData {
    const formData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    return formData;
  }

  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('image', image, image.name);
    return this.http.post(`${this.uri}/image/upload`, formData);
  }

  uploadPDF(pdf: File) {
    const formData = new FormData();
    formData.append('pdf', pdf, pdf.name);
    return this.http.post(`${this.uri}/pdf/upload`, formData);
  }

  register(
    username: String,
    password: String,
    type: String,
    sec_question: String,
    sec_answer: String,
    first_name: String,
    last_name: String,
    gender: String,
    address: String,
    phone: String,
    email: String,
    avatar: String,
    CV: String,
    school_type: String,
    school_year: Number,
    subjects: String[],
    ageGroups: String[],
    sourceOfInformation: String
  ) {
    const data = {
      username: username,
      password: password,
      type: type,
      sec_question: sec_question,
      sec_answer: sec_answer,
      first_name: first_name,
      last_name: last_name,
      gender: gender,
      address: address,
      phone: phone,
      email: email,
      avatar: avatar,
      CV: CV,
      school_type: school_type,
      school_year: school_year,
      subjects: subjects,
      ageGroups: ageGroups,
      sourceOfInformation: sourceOfInformation
    }
    return this.http.post(`${this.uri}/register`, data)
  }

  login(username: String, password: String) {
    const data = {
      username: username,
      password: password
    }

    return this.http.post(`${this.uri}/users/login`, data)
  }

  login_admin(username: String, password: String) {
    const data = {
      username: username,
      password: password
    }

    return this.http.post(`${this.uri}/admin/login`, data)
  }

  getRequests() {
    return this.http.get(`${this.uri}/admin`)
  }

  getImgUrl(imgPath: string): string {
    return `${this.uri}/image/${imgPath}`;
  }

  getPDFUrl(pdfPath: string): string {
    return `${this.uri}/pdf/${pdfPath}`;
  }

  acceptTeacher(username_: String) {
    const data = {
      username: username_
    }
    return this.http.post(`${this.uri}/admin/accept`, data)
  }

  declineTeacher(username_: String) {
    const data = {
      username: username_
    }

    return this.http.post(`${this.uri}/admin/decline`, data)
  }

  changePassword(new_password: String, old_password: String, username_: String, flag_: boolean){
    const data = {
      username: username_? username_ : null,
      old_password: old_password,
      new_password: new_password,
      flag: flag_
    }
    return this.http.post(`${this.uri}/users/changepassword`, data)
  }

  findUser(username_: String){
    const data = {
      username: username_
    }
    return this.http.post(`${this.uri}/users/finduser`, data);
  }

  getNumberOfStudents() {
    return this.http.get(`${this.uri}/users/get-students`)
  }

  getNumberOfTeachers() {
    return this.http.get(`${this.uri}/users/get-teachers`)
  }

  engagedTeachers(sortBy: string, sortOrder: string, searchName: string, searchLast: string, searchSubject: string){
    return this.http.get(`${this.uri}/users/engaged-teachers/?sortBy=${sortBy}&sortOrder=${sortOrder}&searchName=${searchName}&searchLast=${searchLast}&searchSubject=${searchSubject}`)
  }

  changeInfo(username: String, first_name: String, last_name: String, email: String, phone: String, address: String, schoolType: String, currentGrade: number ,avatarPath: String) {
    const data = {
      username: username,
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone: phone,
      address: address,
      school_type: schoolType,
      currentGrade: currentGrade,
      avatarPath: avatarPath
    }
    return this.http.post(`${this.uri}/users/change-information`, data);
  }

  getTeachersForGrade(school_type: String, school_year: number) {
    return this.http.get(`${this.uri}/users/teachers/?type=${school_type}&year=${school_year}`);
  }

  filterTeachers(school_type: String, school_year: number, searchFirst: String, searchLast: String, searchSubject: String, sortBy: String, sortOrder: String){
    return this.http.get(
      `${this.uri}/users/filter/?type=${school_type}&year=${school_year}&first_name=${searchFirst}&last_name=${searchLast}&subject=${searchSubject}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      )
  }

  getTeacher(username: String) {
    return this.http.get(`${this.uri}/users/teacher/?username=${username}`);
  }

  sendClassRequest(username: String, studentUsername: String, first_name: String, last_name: String,
    class_: String, date_: String, topic_: String, doubleClass: boolean) {
    const data = {
      username: username,
      studentUsername: studentUsername,
      first_name: first_name,
      last_name: last_name,
      className: class_,
      dateOf: date_,
      topic: topic_,
      doubleFlag: doubleClass
    }
    return this.http.post(`${this.uri}/class/send-request`, data);
  }

  getClassRequests(username: String) {
    return this.http.get(`${this.uri}/class/?username=${username}`);
  }

  acceptClassRequest(id: String){
    return this.http.get(`${this.uri}/class/accept/?id=${id}`);
  }

  getAcceptedRequests(username_: String) {
    return this.http.get(`${this.uri}/class/accepted/?username=${username_}`)
  }

  getStudents(username_ : String) {
    return this.http.get(`${this.uri}/users/my-students/?username=${username_}`)
  }

  getStudentByClasses(usernameS : String, usernameT: String) {
    return this.http.get(`${this.uri}/users/my-students-classes/?usernameT=${usernameT}&usernameS=${usernameS}`)
  }

  getStudentInfo(username_ : String) {
    return this.http.get(`${this.uri}/users/student/?username=${username_}`)
  }

  getAllStudents() {
    return this.http.get(`${this.uri}/users/all-students`)
  }
  getAllTeachers() {
    return this.http.get(`${this.uri}/users/all-teachers`)
  }

  getAllClasses() {
    return this.http.get(`${this.uri}/class/get-all`)
  }

  addSubject(subject: String) {
    return this.http.get(`${this.uri}/subjects/add/?subject=${subject}`)
  }

  getAllSubjects() {
    return this.http.get(`${this.uri}/subjects/`)
  }
}
