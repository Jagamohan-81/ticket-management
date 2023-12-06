import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authguardGuard } from './authguard.guard';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { TicketKanbanComponent } from './components/ticket-kanban/ticket-kanban.component';
import { CalenderComponent } from './components/calender/calender.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent,canActivate:[authguardGuard] },
  { path: 'dashboard', component: DashboardComponent,canActivate:[authguardGuard] },
  { path: 'calender', component: CalenderComponent,canActivate:[authguardGuard] },
  // { path:'ticket',component:TicketKanbanComponent},
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '**', redirectTo: '/' },
];

// export const routes: Routes = [
//   { path: 'login', component: LoginComponent },
//   {
//     path: 'home',
//     component: HomeComponent,
//     canActivate: [authguardGuard],
//     children: [
//       { path: 'profile', component: ProfileComponent },
//       { path: 'dashboard', component: DashboardComponent },
//       // { path: '', redirectTo: '/', pathMatch: 'full' },
//       // { path: '**', redirectTo: '/' },
//     ],
//   },
// ];