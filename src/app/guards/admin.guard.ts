import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

      // return (this.usuarioService.role === 'ADMIN_ROLE') ? true : false;

      // Validación de usuario administrador
      if(this.usuarioService.role === 'ADMIN_ROLE') {
        return true;
      } else {
        // Si no es administrador, retorna mensaje de error y cierra sesión
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Access Denied',
          text: 'You do not have authorization to enter the requested url, talk to the administrator.',
          showConfirmButton: false,
          timer: 4000
        });
        this.router.navigateByUrl('/login');
        localStorage.removeItem('token');
        localStorage.removeItem('menu');
        return false;
      }
      
    }
  
}
