import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  public usuario: Usuario;

  constructor(private usuarioService: UsuarioService,
              private router: Router) {
    this.usuario = usuarioService.usuario;
  }

  logout() {
    this.usuarioService.logout();
    console.log('funciona');
  }

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
  }

  buscar(termino: string) {
    // console.log(termino);
    if (termino.length === 0) {
      return; 
    }

    this.router.navigateByUrl(`/search/all/${termino}`)
  }

}
