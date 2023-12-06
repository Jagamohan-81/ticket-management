import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControlOptions } from '@angular/forms';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { formatIsoTimeString } from '@fullcalendar/core/internal';
import { TicketboardService } from '../../services/ticketboard.service';
import { environment, localUser } from '../../../enviroment';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, FormsModule, ReactiveFormsModule],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.scss',
})
export class CalenderComponent {
  constructor(private ticketService: TicketboardService) {}
  loading = false;
  ticketsArray: any[] = [];
  developers: any[] = [];
  displayStyle = 'none';
  editDisplayStyle = 'none';
  editForm = false;
  edit_ticket: any = {};
  assignee = '';
  priority_status = '';
  logged_user = '';
  userRole = '';
  currentTicket = '';
  schedule_date: Date = new Date();
  schedule_option = false;
  priorities = [
    { value: 1, label: 'Low' },
    { value: 2, label: 'Medium' },
    { value: 3, label: 'High' },
  ];
  scheduleDisplay = 'none';
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEvetClick.bind(this),
    events: this.ticketsArray,
    headerToolbar: {
      left: 'prev today next',
      center: 'title',
      right: '',
    },
    weekends: true,
    dayMaxEvents: true,
    selectable: true,
    editable: true,
  };
  ticketForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required]),
    status: new FormControl(1),
    created_by: new FormControl(localUser().user.user_id),
    assigned_to: new FormControl('', Validators.required),
    priority: new FormControl(2),
    scheduled_time: new FormControl('required', [
      Validators.required,
      this.futureDateValidator.bind(this),
    ]),
  });
  ticketFormEdit: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    status: new FormControl(1),
    created_by: new FormControl(localUser().user.user_id),
    assigned_to: new FormControl('', Validators.required),
    priority: new FormControl(2),
  });
  sheduleFormEdit: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', [Validators.required]),
    scheduled_time: new FormControl('required', [
      Validators.required,
      this.futureDateValidator.bind(this),
    ]),
  });

  ngOnInit() {
    this.getProjectTickets();
    setTimeout(() => {
      this.getProjectTickets();
      this.getDevelopers();
      const user = localUser().user;
      this.userRole = user.role;
      this.logged_user = user.user_id;
    }, 2200);
    // setTimeout(() => {
    //   this.calendarOptions = {
    //     initialView: 'dayGridMonth',
    //     events: this.ticketsArray,

    //   };
    // }, 2500);
  }
  handleDateClick(arg: any) {
    const inputDate = new Date(arg.dateStr);
    const today = new Date();
    inputDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0); // Set time to midnight
    const twoDaysLater = new Date(today);
    twoDaysLater.setHours(0, 0, 0, 0);
    twoDaysLater.setDate(today.getDate() + 3);
    if (
      // inputDate.getTime() >= twoDaysLater.getTime() ||
      // inputDate.getTime() === today.getTime()
      inputDate.getTime() >= today.getTime()
    ) {
      if (localUser().user.role == 'M') {
        if (inputDate.getTime() != today.getTime()) {
          const year = inputDate.getFullYear();
          const month = String(inputDate.getMonth() + 1).padStart(2, '0');
          const day = String(inputDate.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
          this.ticketForm.get('scheduled_time')?.setValue(formattedDate);
          this.schedule_option = true;
        }
        this.openPopup();
        this.schedule_date = inputDate;
      }
    } else if (inputDate < today) {
      Swal.fire({
        title: 'Oops! Invalid Date',
        text: 'Creating a ticket for past dates is not allowed.',
        icon: 'warning',
      });
    } else {
      Swal.fire({
        title: 'Oops! Invalid Date',
        text: 'You can only create ticket more than 2 days in advance',
        icon: 'warning',
      });
    }
  }
  handleEvetClick(arg: any) {
    console.log(arg.event.id);
    if (arg.event.extendedProps.scheduled_time) {
      // Swal.fire({
      //   title: 'Oops!',
      //   text: 'Schedule tickets cant be modified',
      //   icon: 'warning',
      // });
      this.currentTicket = arg.event.id;
      this.handleView(arg.event.id, true);
    } else {
      this.currentTicket = arg.event.id;
      this.handleView(arg.event.id, false);
    }
  }
  getProjectTickets() {
    console.log("Called all ticket api")
    this.loading = true;
    const projectTickets$ = this.ticketService.getProjectTickets();
    const futureTickets$ = this.ticketService.getFutureTicket();

    forkJoin([projectTickets$, futureTickets$]).subscribe(
      ([projectResponse, futureResponse]: any) => {
        this.loading = false;
        const projectResults = this.mapTickets(projectResponse.results);
        const futureResults = this.mapTickets(futureResponse.results);
        // Combine the results from both APIs into a single array
        const combinedResults = [...projectResults, ...futureResults];

        this.ticketsArray = combinedResults;

        this.calendarOptions = {
          events: combinedResults,
        };
      },
      (error) => {
        this.loading = false;
        console.error('Error fetching tickets:', error);
      }
    );

    // this.loading = true;
    // this.ticketService.getProjectTickets().subscribe((res: any) => {
    //   this.loading = false;
    //   const results = res.results.map((ticket: any) => {
    //     const date = new Date(ticket.created_time);
    //     ticket.date = date.toISOString().slice(0, 10);
    //     ticket.backgroundColor =
    //       ticket.status == 'Todo'
    //         ? 'blue'
    //         : ticket.status == 'In Progress'
    //         ? 'orange'
    //         : 'green';
    //     return ticket;
    //   });
    //   this.ticketsArray = results;

    //   this.calendarOptions = {
    //     events: results,
    //   };
    // });
    // this.ticketService.getFutureTicket().subscribe((res: any) => {
    //   this.loading = false;
    //   const results = res.results.map((ticket: any) => {
    //     const date = new Date(ticket.created_time);
    //     ticket.date = date.toISOString().slice(0, 10);
    //     ticket.backgroundColor =
    //       ticket.status == 'Todo'
    //         ? 'blue'
    //         : ticket.status == 'In Progress'
    //         ? 'orange'
    //         : 'green';
    //     return ticket;
    //   });
    //   this.ticketsArray = results;

    //   this.calendarOptions = {
    //     events: results,
    //   };
    //   // console.log('here--', this.calendarOptions.events);
    // });
  }
  openPopup() {
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
    this.resetForm();
  }
  editTicketOpenPopup() {
    this.editDisplayStyle = 'block';
  }
  editFormPopupClose() {
    this.loading = false;
    this.editDisplayStyle = 'none';
    this.editForm = false;
  }
  getDevelopers() {
    this.ticketService.getDevelopers().subscribe((res: any) => {
      this.developers = res.results;
    });
  }
  ticketSubmit() {
    this.loading = true;
    if (this.schedule_option == true) {
      this.ticketService
        .createFutureTicket(
          this.ticketForm.value,
          this.ticketForm.value.scheduled_time
        )
        .subscribe(
          (res: any) => {
            this.loading = false;
            this.getProjectTickets();
            this.closePopup();
            Swal.fire(
              'Scheduled !',
              `${res.title} scheduled to create successfully.`,
              'success'
            );
          },
          (error) => {
            this.loading = false;
            console.error('Error fetching subjects:', error);
          }
        );
    } else {
      this.ticketService.createTicket(this.ticketForm.value).subscribe(
        (res: any) => {
          this.loading = false;
          this.getProjectTickets();
          this.closePopup();
          Swal.fire(
            'Created!',
            `${res.title} Created Successfully.`,
            'success'
          );
        },
        (error) => {
          this.loading = false;
          console.error('Error fetching subjects:', error);
        }
      );
    }
  }
  handleEditSubmit(): void {
    this.loading = true;
    if (this.editForm) {
      this.ticketService
        .updateTicket(this.edit_ticket.id, this.ticketFormEdit.value)
        .subscribe(
          (res: any) => {
            console.log('Update successful', res);
            this.loading = false;
            this.getProjectTickets();
            this.editFormPopupClose();
            Swal.fire('Modified!', 'Ticket Edited Successfully.', 'success');
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
  allowToEdit() {
    if (
      this.logged_user == this.edit_ticket?.assigned_to?.id ||
      this.userRole == 'M'
    ) {
      return true;
    }
    return false;
  }
  handleView(id: string, future: boolean) {
    this.loading = true;
    if (future) {
      this.ticketService.getFutureTicketById(id).subscribe(
        (ticket: any) => {
          
          const prio = this.priorities.filter(
            (prio: any) => prio.label == ticket.priority
          );
          const status =
            ticket.status == 'Todo' ? 1 : ticket.status == 'Done' ? 3 : 2;
          this.edit_ticket = ticket;
          const date =  new Date(ticket.scheduled_time)
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const scheduled_time = `${year}-${month}-${day}`;
          this.sheduleFormEdit = new FormGroup({
            title: new FormControl(ticket.title),
            description: new FormControl(ticket.description),
            scheduled_time: new FormControl(scheduled_time),
          });
          this.assignee = `${ticket.assigned_to.first_name} ${ticket.assigned_to.last_name}`;
          // this.priority_status = ticket.priority;
          this.loading = false;
          this.scheduleTicketOpenPopup();
        },
        (error) => {
          console.log('error--', error);
        }
      );
    } else {
      this.ticketService.getTicketById(id).subscribe(
        (ticket: any) => {
          // console.log(res,222)
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
          this.loading = false;
          this.editTicketOpenPopup();
        },
        (error) => {
          console.log('error--', error);
        }
      );
    }
  }
   handleDelete() {
    if(this.edit_ticket.scheduled_time){
      return this.ticketService.deleteFutureTicketById(this.currentTicket);
    }else{
      return this.ticketService.deleteTicketById(this.currentTicket);
    }
    
  }
  confirmBox() {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this ticket!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.handleDelete().subscribe(
          (res: any) => {
            Swal.fire('Deleted!', 'Ticket Deleted Successfully.', 'success');
            this.getProjectTickets();
            this.loading = false;
            this.editFormPopupClose();
            this.scheduleFormPopupClose()
          },
          (error) => {
            console.log('error-', error);
            this.loading = false;
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your ticket is safe :)', 'error');
      }
    });
  }
  handleOptionChange() {
    this.schedule_option = !this.schedule_option;
  }
  futureDateValidator(control: FormControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    // Calculate the date after 2 days
    const minDate = new Date(currentDate);
    minDate.setDate(currentDate.getDate() + 2);

    if (selectedDate <= minDate) {
      return { minDateNotMet: true };
    }

    return null;
  }
  getTodayDate(): string {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const formattedDate =
      today.getFullYear() +
      '-' +
      (month < 10 ? '0' : '') +
      month +
      '-' +
      (day < 10 ? '0' : '') +
      day;
    return formattedDate;
  }
  resetForm() {
    this.ticketForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
      status: new FormControl(1),
      created_by: new FormControl(localUser().user.user_id),
      assigned_to: new FormControl('', Validators.required),
      priority: new FormControl(2),
      scheduled_time: new FormControl('required', [
        Validators.required,
        this.futureDateValidator.bind(this),
      ]),
    });
    this.schedule_option = false;
  }
  mapTickets(tickets: any[]): any[] {
    return tickets.map((ticket: any) => {
      const date = ticket.created_time
        ? new Date(ticket.created_time)
        : new Date(ticket.scheduled_time);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      ticket.date = `${year}-${month}-${day}`;

      ticket.backgroundColor = ticket.scheduled_time
        ? 'grey'
        : ticket.status === 'Todo'
        ? 'blue'
        : ticket.status === 'In Progress'
        ? 'orange'
        : 'green';
      return ticket;
    });
  }
  scheduleTicketOpenPopup() {
    this.scheduleDisplay = 'block';
  }
  scheduleFormPopupClose() {
    this.loading = false;
    this.scheduleDisplay = 'none';
    this.editForm = false;
  }
  handleFutureEdit(){
    this.loading = true;
    if (this.editForm) {
      this.ticketService
        .updateFutureTicket(this.edit_ticket.id, this.sheduleFormEdit.value)
        .subscribe(
          (res: any) => {
            console.log('Update successful', res);
            this.loading = false;
            this.getProjectTickets();
            this.scheduleFormPopupClose()
            
            Swal.fire('Success!', 'Scheduled Ticket Modified Successfully.', 'success');
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
}
