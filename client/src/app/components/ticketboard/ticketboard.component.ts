import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketboardService } from '../../services/ticketboard.service';
import { HttpClient } from '@angular/common/http';
import { environment, localUser } from '../../../enviroment';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ticketboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ticketboard.component.html',
  styleUrl: './ticketboard.component.scss',
})
export class TicketboardComponent {
  ticketsArray: any[] = [];
  selectedTicket: any;
  status: string[] = ['Todo', 'In Progress', 'Done'];

  Todo: any[] = [];
  InPogress: any[] = [];
  Done: any[] = [];

  userRole: string = '';
  loading = false;
  displayStyle = 'none';
  editDisplayStyle = 'none';
  editForm = false;
  assignee = '';
  priority_status = '';
  edit_ticket: any = {};
  mytickets = true;
  priorities = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' },
  ];
  developers: any[] = [];
  logged_user: any = '';
  ticketsForYou: any[] = [];
  ticketForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    status: new FormControl(1),
    created_by: new FormControl(localUser().user.user_id),
    assigned_to: new FormControl('', Validators.required),
    priority: new FormControl(2),
  });
  ticketFormEdit: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    status: new FormControl(1),
    created_by: new FormControl(localUser().user.user_id),
    assigned_to: new FormControl('', Validators.required),
    priority: new FormControl(2),
    created_time: new FormControl(''),
  });
  constructor(private ticketService: TicketboardService) {
    this.getDevelopers();
    this.getProjectTickets();
    const user = localUser().user;
    this.userRole = user.role;
    this.logged_user = user.user_id;
    if (user) {
      this.fethMyTickets(user.user_id);
      this.userRole = user.role;
    }
  }

  handleApiResponse(
    observable: Observable<any>,
    successCallback: () => void,
    errorCallback: (error: any) => void
  ): void {
    observable.subscribe(
      (res: any) => {
        this.loading = false;
        successCallback();
      },
      (error: any) => {
        this.loading = false;
        alert(error.detail);
        console.error('Error fetching subjects:', error);
        errorCallback(error);
      }
    );
  }

  updatePriorityApiCall(
    ticketId: number,
    requestData: any,
    successCallback: () => void,
    errorCallback: (error: any) => void
  ): void {
    this.handleApiResponse(
      this.ticketService.updatePriority(ticketId, requestData),
      successCallback,
      errorCallback
    );
  }

  getProjectTickets() {
    this.loading = true;
    this.ticketService.getProjectTickets().subscribe((res: any) => {
      this.loading = false;
      // this.ticketsArray = res.results;
      this.sortLinkedList(res.results);
    });
  }

  sortLinkedList(arr: any) {
    const Todo = this.sortList(
      arr.filter((m: any) => m.status == this.status[0])
    );
    const InProgress = this.sortList(
      arr.filter((m: any) => m.status == this.status[1])
    );
    const Done = this.sortList(
      arr.filter((m: any) => m.status == this.status[2])
    );
    this.ticketsArray = [...Todo, ...InProgress, ...Done];
  }

  sortList(arr: any) {
    const newArray: any[] = [];
    let currentHead = arr.findIndex((ticket: any) => ticket.next === 0);

    while (currentHead !== -1) {
      const currentTicket = arr[currentHead];
      newArray.push(currentTicket);

      currentHead = arr.findIndex(
        (ticket: any) => ticket.next === currentTicket.id
      );
    }

    // Filter and push the remaining elements
    const remainingElements = arr.filter((ticket: any) =>
      newArray.every((t) => t.id !== ticket.id)
    );
    newArray.push(...remainingElements);

    console.log(newArray, 'here');
    return newArray;
  }

  getDevelopers() {
    this.ticketService.getDevelopers().subscribe((res: any) => {
      this.developers = res.results;
    });
  }

  filterTicket(status: string) {
    return this.ticketsArray.filter((m) => m.status == status);
  }

  allowDrop(e: any) {
    // console.log('allowdrop',e)
    e.preventDefault();
  }

  drag(e: any, ticket: any, index: number) {
    this.selectedTicket = ticket;
    // console.log('drag event--', e.target);
  }

  drop(e: any, status: string, ticket: any) {
    e.preventDefault();
    const newStatus = this.status.indexOf(status) + 1;
    this.loading = true;

    const sameStatus = this.ticketsArray.filter(
      (tic: any) => tic.status == ticket.status
    );
    const sameStatusOldCol = this.ticketsArray.filter(
      (tic: any) => tic.status == this.selectedTicket.status
    );
    const selectedTicketIndex = sameStatusOldCol.findIndex(
      (tic: any) => tic.id === this.selectedTicket.id
    );

    const droppedTicketIndex = sameStatus.findIndex(
      (tic: any) => tic.id === ticket.id
    );
    const beforeTicket = sameStatus[droppedTicketIndex + 1];

    console.log(
      'sameStatus',
      sameStatus,
      'sameStatusOldCol-',
      sameStatusOldCol,
      selectedTicketIndex,
      droppedTicketIndex,
      'ticket',
      ticket
    );

    if (selectedTicketIndex !== -1) {
      if (ticket.status == this.selectedTicket.status) {
        console.log('same');

        if (selectedTicketIndex < droppedTicketIndex) {
          if (selectedTicketIndex === 0) {
            console.log(111111);
            this.updatePriorityApiCall(
              sameStatusOldCol[selectedTicketIndex + 1].id,
              { next: 0 },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );
          } else if (selectedTicketIndex < sameStatusOldCol.length - 1) {
            console.log(22222);
            this.updatePriorityApiCall(
              sameStatusOldCol[selectedTicketIndex + 1].id,
              {
                next: sameStatusOldCol[selectedTicketIndex - 1].id,
              },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );
          }
          // For droppedTicketIndex
          if (droppedTicketIndex === 0) {
            console.log(333, ticket, this.selectedTicket);
            this.updatePriorityApiCall(
              sameStatus[droppedTicketIndex].id,
              { next: this.selectedTicket.id },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );

            this.updatePriorityApiCall(
              this.selectedTicket.id,
              { next: 0 },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );
          } else if (droppedTicketIndex < sameStatus.length - 1) {
            console.log(44444);
            this.updatePriorityApiCall(
              this.selectedTicket.id,
              { next: sameStatus[droppedTicketIndex - 1].id },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );
            this.updatePriorityApiCall(
              sameStatus[droppedTicketIndex].id,
              { next: this.selectedTicket.id },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );
          } else {
            console.log(55555);
            this.updatePriorityApiCall(
              sameStatus[droppedTicketIndex].id,
              { next: sameStatus[droppedTicketIndex - 1].id },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );

            this.updatePriorityApiCall(
              this.selectedTicket.id,
              { next: 9999999999 },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );
          }
        } else {
          if (selectedTicketIndex === 0) {
            console.log(111111);
            this.updatePriorityApiCall(
              sameStatusOldCol[selectedTicketIndex + 1].id,
              { next: 0 },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );
          } else if (selectedTicketIndex < sameStatusOldCol.length - 1) {
            console.log(22222);
            // this.updatePriorityApiCall(
            //   sameStatusOldCol[selectedTicketIndex + 1].id,
            //   {
            //     next: sameStatusOldCol[selectedTicketIndex - 1].id,
            //   },
            //   () => this.handleSuccess(),
            //   (error) => this.handleError(error)
            // );
          }
          // For droppedTicketIndex
          if (droppedTicketIndex === 0) {
            console.log(333, ticket, this.selectedTicket);
            this.updatePriorityApiCall(
              sameStatus[droppedTicketIndex].id,
              { next: this.selectedTicket.id },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );

            this.updatePriorityApiCall(
              this.selectedTicket.id,
              { next: 0 },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );
          } else if (droppedTicketIndex < sameStatus.length - 1) {
            console.log(44444);
            this.updatePriorityApiCall(
              this.selectedTicket.id,
              { next: sameStatus[droppedTicketIndex - 1].id },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );
            this.updatePriorityApiCall(
              sameStatus[droppedTicketIndex].id,
              { next: this.selectedTicket.id },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );
          } else {
            console.log(55555);
            this.updatePriorityApiCall(
              this.selectedTicket.id,
              { next: this.selectedTicket.id },
              () => this.handleSuccess(),
              (error) => this.handleError(error)
            );

            // this.updatePriorityApiCall(
            //   sameStatus[droppedTicketIndex].id,
            //   { next: this.selectedTicket.id },
            //   () => this.handleSuccess(),
            //   (error) => this.handleError(error)
            // );
          }
        }
      } else {
        if (selectedTicketIndex === 0) {
          console.log(111111);
          this.updatePriorityApiCall(
            sameStatusOldCol[selectedTicketIndex + 1].id,
            { next: 0 },
            () => this.handleSuccess(),
            (error) => this.handleError(error)
          );
        } else if (selectedTicketIndex < sameStatusOldCol.length - 1) {
          console.log(22222);
          this.updatePriorityApiCall(
            sameStatusOldCol[selectedTicketIndex + 1].id,
            {
              next: sameStatusOldCol[selectedTicketIndex - 1].id,
            },
            () => this.handleSuccess(),
            (error) => this.handleError(error)
          );
        }
        // For droppedTicketIndex
        if (droppedTicketIndex === 0) {
          console.log(333, ticket, this.selectedTicket);
          this.updatePriorityApiCall(
            sameStatus[droppedTicketIndex].id,
            { next: this.selectedTicket.id, status: newStatus },
            () => this.handleSuccess(),
            (error) => this.handleError(error)
          );

          this.updatePriorityApiCall(
            this.selectedTicket.id,
            { next: 0, status: newStatus },
            () => this.handleSuccess(),
            (error) => this.handleError(error)
          );
        } else if (droppedTicketIndex < sameStatus.length - 1) {
          console.log(44444);
          this.updatePriorityApiCall(
            this.selectedTicket.id,
            { next: sameStatus[droppedTicketIndex - 1].id, status: newStatus },
            () => this.handleSuccess(),
            (error) => this.handleError(error)
          );
          this.updatePriorityApiCall(
            sameStatus[droppedTicketIndex].id,
            { next: this.selectedTicket.id, status: newStatus },
            () => this.handleSuccess(),
            (error) => this.handleError(error)
          );
        } else {
          console.log(55555);
          this.updatePriorityApiCall(
            this.selectedTicket.id,
            { next: sameStatus[droppedTicketIndex].id, status: newStatus },
            () => this.handleSuccess(),
            (error) => this.handleError(error)
          );

          this.updatePriorityApiCall(
            sameStatus[droppedTicketIndex].id,
            { next: sameStatus[droppedTicketIndex - 1].id, status: newStatus },
            () => this.handleSuccess(),
            (error) => this.handleError(error)
          );
        }
      }
    } else {
      console.error('Selected ticket not found in the ticketsArray.');
    }
  }

  private handleSuccess(): void {
    this.loading = false;
    // Only call this.getProjectTickets() once after all updates are completed
    this.getProjectTickets();
  }

  private handleError(error: any): void {
    this.loading = false;
    alert(error.detail);
    console.error('Error fetching subjects:', error);
  }

  allowToEdit() {
    if (
      this.logged_user == this.edit_ticket?.assigned_to?.id ||
      this.userRole == 'M'
    ) {
      return true;
    }
    return false;
  }
  openPopup() {
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
  }
  ticketSubmit() {
    this.loading = true;
    this.ticketService.createTicket(this.ticketForm.value).subscribe(
      (res: any) => {
        this.loading = false;
        this.getProjectTickets();
        this.closePopup();
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching subjects:', error);
      }
    );
  }

  handleView(ticket: any) {
    const prio = this.priorities.filter(
      (prio: any) => prio.label == ticket.priority
    );
    const status =
      ticket.status == 'Todo' ? 1 : ticket.status == 'Done' ? 3 : 2;
    this.edit_ticket = ticket;
    this.ticketFormEdit = new FormGroup({
      title: new FormControl(ticket.title),
      description: new FormControl(ticket.description),
      status: new FormControl(status),
      created_by: new FormControl(
        ticket.created_by.first_name + ticket.created_by.last_name
      ),
      assigned_to: new FormControl(ticket.assigned_to.id),
      priority: new FormControl(prio[0].value),
      created_time: new FormControl(ticket.created_time),
    });
    this.assignee = `${ticket.assigned_to.first_name} ${ticket.assigned_to.last_name}`;
    this.priority_status = ticket.priority;
    this.editTicketOpenPopup();
  }
  editTicketOpenPopup() {
    this.editDisplayStyle = 'block';
  }
  editFormPopupClose() {
    this.editDisplayStyle = 'none';
    this.editForm = false;
  }
  handleEditSubmit(): void {
    
    if(this.editForm){
      this.loading = true;
      this.handleApiResponse(
        this.ticketService.updateTicket(
          this.edit_ticket.id,
          this.ticketFormEdit.value
          
        ),
        () => {
          // Success callback
          console.log('Update successful');
          this.loading = false;
          this.getProjectTickets();
          this.editFormPopupClose();
        },
        (error: any) => {
          // Error callback
          console.error('Error updating ticket:', error);
          this.loading = false;
        }
      );
    }
    this.editForm = true;
  }

  // showMyTickets() {
  //   this.loading = true;
  //   if (!this.mytickets) {
  //     this.fethMyTickets(this.logged_user);
  //   } else {
  //     this.getProjectTickets();
  //   }

  //   this.mytickets = !this.mytickets;
  // }

  fethMyTickets(id: any) {
    this.ticketService.getMyTickets(id).subscribe(
      (res: any) => {
        this.loading = false;
        this.ticketsForYou = res.results;
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching subjects:', error);
      }
    );
  }
  handleDelete() {
    this.loading = true;
    this.ticketService.deleteTicketById(this.edit_ticket.id).subscribe((res: any) => {
      console.log(res);
      this.getProjectTickets();
      this.loading=false
    },(error)=>{
      console.log("error-",error)
      this.loading=false
    }
    );
  }
}
