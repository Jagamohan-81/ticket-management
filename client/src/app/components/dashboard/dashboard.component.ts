import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentListComponent } from "../student-list/student-list.component"
import { SubjectListComponent } from "../subject-list/subject-list.component";
import { MarkListComponent } from "../mark-list/mark-list.component";
import { isPlatformBrowser } from '@angular/common';
import { TicketboardComponent } from '../ticketboard/ticketboard.component';
@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [CommonModule, StudentListComponent, SubjectListComponent, MarkListComponent,TicketboardComponent]
})
export class DashboardComponent {
  userRole: string | null = null;

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user.role;
  }
 
}
