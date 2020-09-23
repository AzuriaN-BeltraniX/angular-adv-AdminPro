import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [
    { // Dashboard Menu
      title: 'Dashboard',
      icon: 'mdi mdi-gauge',
      submenu: [
        {titulo: 'Main', url: '/dashboard'},
        {titulo: 'Progress Bars', url: '/dashboard/progress'},
        {titulo: 'Angular Graphics', url: '/dashboard/grafica1'},
        {titulo: 'Promises', url: '/dashboard/promises'},
        {titulo: 'JavaScript RxJs', url: '/dashboard/rxjs'}
      ]
    },
    { // Maintenance Menu
      title: 'Maintenance',
      icon: 'mdi mdi-folder-lock-open',
      submenu: [
        {titulo: 'Users', url: '/maintenance/users'},
        {titulo: 'Hospitals', url: '/maintenance/hospitals'},
        {titulo: 'Doctors', url: '/maintenance/doctors'}
      ]
    }
  ];

  constructor() { }
}
