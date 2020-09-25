import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor(private router: Router) { }

  public menu = [];

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];

    // Si no existe el menu en el LocalStorage, cierra sesión, y emite mensaje de error al usuario
    if (this.menu.length === 0) {
      // Muestra el mensaje de error    
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'An error has occurred',
          text: ' Please log in again...',
          showConfirmButton: false,
          timer: 3500
        });

      this.router.navigateByUrl('/login');
      localStorage.removeItem('token');
    }
  }

  // menu: any[] = [
  //   { // Dashboard Menu
  //     title: 'Dashboard',
  //     icon: 'mdi mdi-gauge',
  //     submenu: [
  //       {titulo: 'Main', url: '/dashboard'},
  //       {titulo: 'Progress Bars', url: '/dashboard/progress'},
  //       {titulo: 'Angular Graphics', url: '/dashboard/grafica1'},
  //       {titulo: 'Promises', url: '/dashboard/promises'},
  //       {titulo: 'JavaScript RxJs', url: '/dashboard/rxjs'}
  //     ]
  //   },
  //   { // Maintenance Menu
  //     title: 'Maintenance',
  //     icon: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       {titulo: 'Users', url: '/maintenance/users'},
  //       {titulo: 'Hospitals', url: '/maintenance/hospitals'},
  //       {titulo: 'Doctors', url: '/maintenance/doctors'}
  //     ]
  //   }
  // ];

}
