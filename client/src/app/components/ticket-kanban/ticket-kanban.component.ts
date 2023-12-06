import { Component ,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-ticket-kanban',
  standalone: true,
  imports: [CommonModule,CdkDropListGroup, CdkDropList, CdkDrag,DragDropModule ],
  templateUrl: './ticket-kanban.component.html',
  styleUrl: './ticket-kanban.component.scss'
})
export class TicketKanbanComponent {
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  constructor(private cdr:ChangeDetectorRef ){}
  drop(event: CdkDragDrop<string[]>) {
    console.log('event--',event.container.data, event.previousIndex, event.currentIndex)
    this.cdr.detectChanges()
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    
  }

}
