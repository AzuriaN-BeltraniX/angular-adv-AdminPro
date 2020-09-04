import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromisesComponent } from './promises/promises.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
    {
    path: 'dashboard',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
        { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'} },
        { path: 'progress', component: ProgressComponent, data: {titulo: 'Progress Bars'} },
        { path: 'grafica1', component: Grafica1Component, data: {titulo: 'Angular Graphics'} },
        { path: 'accountSettings', component: AccountSettingsComponent, data: {titulo: 'Account Settings'} },
        { path: 'promises', component: PromisesComponent, data: {titulo: 'Promises'} },
        { path: 'rxjs', component: RxjsComponent, data: {titulo: 'JavaScript RxJs'} },
        { path: 'profile', component: ProfileComponent, data: {titulo: 'Profile'} }
    ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}
