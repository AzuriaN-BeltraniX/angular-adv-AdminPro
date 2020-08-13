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
    }
  ];

  constructor() { }
}
