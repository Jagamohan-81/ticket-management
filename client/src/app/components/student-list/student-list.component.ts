import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { StudentlistService } from '../../services/studentlist.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Student {
  id: Number;
  email: String;
  first_name: String;
  last_name: String;
  password: String;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.scss',
})
export class StudentListComponent implements OnInit {
  loading = false;
  isModalOpen: boolean = false;
  studentList: Student[] = [];
  edit_id: Number = 0;
  studentForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    email: new FormControl(''),
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private studentService: StudentlistService,
  ) {}
  ngOnInit() {
    this.getAllStudents();
  }
  getAllStudents() {
    this.studentService.getAllUserList().subscribe((res: any) => {
      this.studentList = res;
    });
  }

  onSubmit() {
    this.loading = true;
    const newStudent = this.studentForm.value;
    console.log(this.studentForm.value, 777);
    if (this.edit_id == 0) {
      this.studentService.addNewUser(newStudent).subscribe((res: any) => {
        this.loading = false;
        alert("Student Added !")
        this.getAllStudents();
      }); 
    } else {
      if (newStudent.password === null || newStudent.password === '') {
        delete newStudent.password;
      }
      this.studentService
        .editUser(newStudent, this.edit_id)
        .subscribe((res: any) => {
          this.loading = false;
          alert("Student Details Updated !")
          this.clearInputForm();
        });
    }
  }
  clearInputForm() {
    this.getAllStudents();
    this.studentForm = new FormGroup({
      email: new FormControl(''),
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      password: new FormControl(''),
    });
    this.edit_id = 0;
  }
  handleEdit(student: Student) {
    this.studentForm = new FormGroup({
      // id: new FormControl(''),
      email: new FormControl(student.email),
      first_name: new FormControl(student.first_name),
      last_name: new FormControl(student.last_name),
      password: new FormControl(student.password),
    });
    this.edit_id = student.id;

    console.log('Edit button clicked ', student);
  }
  handleDelete(student: Student) {
    this.loading=true
    this.studentService.deleteUser(student.id).subscribe((res: any) => {
      this.loading=false
      alert("Student Removed !")
      this.getAllStudents();
    });
  }
}
