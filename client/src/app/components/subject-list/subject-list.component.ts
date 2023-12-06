import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectService } from '../../services/subject.service';
import {
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';

interface Subject {
  id: number;
  name: string;
}
interface MarkList {
  id: Number;
  subject_name: String;
  mark: String;
  student_id: Number;
}
@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.scss',
})
export class SubjectListComponent implements OnInit {
  all_marks: MarkList[] = [];
  subjects: Subject[] = [];
  newSubject: Subject = { id: 0, name: '' };
  selectedSubject: number | null = null;
  editedSubject: Subject = { id: 0, name: '' };

  constructor(private subjectService: SubjectService) {}
  userRole: string | null = null;
  ngOnInit() {
    this.getSubjects();
    this.getMarks();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userRole = user.role;
  }

  getSubjects() {
    this.subjectService.getSubjects().subscribe(
      (subjects) => {
        this.subjects = subjects;
      },
      (error) => {
        console.error('Error fetching subjects:', error);
      }
    );
  }

  onSubmit() {
    if (this.newSubject.name.trim() === '') {
      return;
    }

    this.subjectService.addSubject(this.newSubject).subscribe(
      (subject) => {
        this.subjects.push(subject);
        this.newSubject.name = '';
        this.getSubjects();
      },
      (error) => {
        console.error('Error adding subject:', error);
      }
    );
  }

  onEditSubmit() {
    if (this.editedSubject.name.trim() === '') {
      return;
    }

    if (this.selectedSubject) {
      this.subjectService
        .editSubject(this.selectedSubject, this.editedSubject)
        .subscribe(
          (subject) => {
            this.selectedSubject = null;
            this.editedSubject = { id: 0, name: '' };
            this.getSubjects();
          },
          (error) => {
            console.error('Error editing subject:', error);
          }
        );
    }
  }
  getMarks() {
    this.subjectService.allMarks().subscribe(
      (marks) => {
        this.all_marks = marks;
      },
      (error) => {
        console.error('Error fetching subjects:', error);
      }
    );
  }
  calculateAvg(subject_name: String) {
    const marksForSubject = this.all_marks.filter(
      (mark) => mark.subject_name == subject_name
    );
    if (marksForSubject.length > 0) {
      const totalMarks = marksForSubject.reduce(
        (total, mark) => total + Number(mark.mark),
        0
      );
      return totalMarks / marksForSubject.length;
    } else {
      return 0; // Return 0 if there are no marks for the specified subject
    }
  }
  deleteSubject(subject: any) {
    this.subjectService.deleteSubject(subject.id).subscribe((res: any) => {
      this.getSubjects();
      console.log('Response of delete---', res);
    });
  }
}

