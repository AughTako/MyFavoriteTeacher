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

    return this.http.post(`${this.uri}/login`, data)
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

  getPDFUrl(pdfPath: string): string {
    return `${this.uri}/pdf/${pdfPath.replace('C:/Users/Nazgul/Desktop/Project/backend/uploads', '')}`;
  }
}
