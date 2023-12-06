import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentDetailsService } from '../../services/studentdetails.service';
interface Mark {
  mark: Number;
  subject_name: String;
  id: Number;
}

interface Marks {
  mark: Number | null;
  subject_name: String | null;
  student_id: String | Number;
}
interface Subject {
  id: number;
  name: string;
}
@Component({
  selector: 'app-student-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.scss',
})
export class StudentDetailsComponent {
  studentId: Number = 0;
  studentDetails: any; // Change the type based on your data model
  user_id: String | null = null;
  all_marks: Mark[] = [];
  subjects: Subject[] = [];
  selectedSubject: String | null = null;
  securedMark: Number | null = null;
  loading=false
  edit_mark: Mark = {
    mark: 0,
    subject_name: '',
    id: 0,
  };
  displayStyle = 'none';
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private studetSerive: StudentDetailsService
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.studentId = Number(params['studentId']);
      this.fetchStudentDetails();
      this.getMark();
      this.getSubjects();
    });
  }
  fetchStudentDetails() {
    this.studetSerive.getUser(this.studentId).subscribe((res: any) => {
      this.studentDetails = res;
    });
  }
  getMark() {
    if (this.studentId) {
      this.studetSerive.getMark(this.studentId).subscribe((res: any) => {
        this.all_marks = []
        this.all_marks = res.results;
        // console.log("Get mark refreshed")
      });
    }
  }
  calculateTotalMarks(): Number {
    return this.all_marks.reduce((total, mark) => total + Number(mark.mark), 0);
  }
  getSubjects() {
    this.loading=true
    this.studetSerive.getSubjects().subscribe((res: any) => {
      this.subjects = res.results;
      this.loading=false
    });
  }
  submitMark() {
    this.loading=true
    const data: Marks = {
      mark: this.securedMark,
      student_id: this.studentId,
      subject_name: this.selectedSubject,
    };
    if (this.selectedSubject) {
      this.studetSerive.addMark(data).subscribe((res: any) => {
        this.getMark();
        this.loading=false
      });
    }
  }
  deleteMark(id: Number) {
    this.loading=true
    this.studetSerive.deleteMark(id).subscribe((res: any) => {
      this.loading=false
      alert('Mark Deleted !');
      this.getMark();
    });
  }
  editMark() {
    this.loading=true
    const data: Marks = {
      mark: this.edit_mark.mark,
      subject_name: this.edit_mark.subject_name,
      student_id: this.studentId,
    };
    this.studetSerive
      .editMark(this.edit_mark.id, data)
      .subscribe((res: any) => {
        this.closePopup();
        this.loading=false
        this.getMark();

      });
  }
  handleEdit(id: Number) {}
  openPopup(mark: Mark) {
    this.edit_mark.id = mark.id;
    this.edit_mark.subject_name = mark.subject_name;
    this.edit_mark.mark = mark.mark;
    this.displayStyle = 'block';
  }
  closePopup() {
    this.edit_mark.id = 0;
    this.edit_mark.subject_name = '';
    this.edit_mark.mark = 0;
    this.displayStyle = 'none';
  }
}
