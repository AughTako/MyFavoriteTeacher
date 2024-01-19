import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Request } from '../models/request';
import { UnifiedService } from '../service/unified.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  requests: Request[] = [];

  constructor(private service: UnifiedService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.getRequests();
    
  }

  getRequests() {
    
    this.service.getRequests().subscribe((requests_: Request[]) => {
      if (requests_) {
        this.requests = requests_;
      }
    });
  }

  openPDF(pdfPath: String) {
    const pdfUrl = this.service.getPDFUrl(pdfPath.toString().replace('C:\\Users\\Nazgul\\Desktop\\Project\\backend\\uploads\\pdfs\\', ''));
    window.open(pdfUrl.toString(), '_blank');
  }
}
