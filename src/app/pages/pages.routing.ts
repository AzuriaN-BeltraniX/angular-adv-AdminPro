import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

// Profile
import { ProfileComponent } from './profile/profile.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';
// ...Rutas Dashboard
import { PagesComponent } from './pages.component';

// Maintenance
import { UsersComponent } from './maintenance/users/users.component';
import { HospitalsComponent } from './maintenance/hospitals/hospitals.component';
import { DoctorsComponent } from './maintenance/doctors/doctors.component';
import { DoctorComponent } from './maintenance/doctors/doctor.component';


const routes: Routes = [
    {
        path: 'users',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
           // Profile 
           { path: 'profile', component: ProfileComponent, data: {titulo: 'User Profile'} },
           { path: 'accountSettings', component: AccountSettingsComponent, data: {titulo: 'Account Settings'} },
        ]
    },
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            // Dashboard
            { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
            { path: 'progress', component: ProgressComponent, data: {titulo: 'Progress Bars'} },
            { path: 'grafica1', component: Grafica1Component, data: {titulo: 'Angular Graphics'} },
            { path: 'promises', component: PromisesComponent, data: {titulo: 'Promises'} },
            { path: 'rxjs', component: RxjsComponent, data: {titulo: 'JavaScript RxJs'} },
        ]
    },
    {
        path: 'maintenance',
        component: PagesComponent,
        canActivate: [AuthGuard],
        children: [
            // Maintenance
            { path: 'users', component: UsersComponent, data: {titulo: 'Users Maintenance'} },
            { path: 'hospitals', component: HospitalsComponent, data: {titulo: 'Hospitals Maintenance'} },
            { path: 'doctors', component: DoctorsComponent, data: {titulo: 'Doctors Maintenance'} },
            { path: 'doctor/:id', component: DoctorComponent, data: {titulo: 'Doctor Maintenance'} }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
