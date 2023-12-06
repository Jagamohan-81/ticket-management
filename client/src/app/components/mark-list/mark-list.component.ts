import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Mark{
  mark:Number,
  subject_name:String
}

@Component({
  selector: 'app-mark-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mark-list.component.html',
  styleUrl: './mark-list.component.scss',
})
export class MarkListComponent {
  user_id:String | null =null
  all_marks:Mark[]=[]
  constructor(private http:HttpClient){
    
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.user_id = user.user_id;
    this.getMark()
    
  }
 
  getMark() {
    if(this.user_id){
      this.http.get(`http://localhost:8000/marklist/?student_id=${this.user_id}`).subscribe((res: any) => {
      this.all_marks=res.results
    });
    }
  }
  calculateTotalMarks(): Number {
    return this.all_marks.reduce((total, mark) => total + Number(mark.mark), 0);
  }
}
