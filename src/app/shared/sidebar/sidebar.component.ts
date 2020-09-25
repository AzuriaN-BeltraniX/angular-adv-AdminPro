import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  // public menuItems: any[];
  // public imgURL = '';
  public usuario: Usuario;

  constructor(public sidebarService: SidebarService,
              private usuarioService: UsuarioService) {

    // this.menuItems = sidebarService.menu;
    this.usuario = usuarioService.usuario;
    // this.imgURL = usuarioService.usuario.imagenUrl;
    // console.log(this.menuItems);
    
  }

  ngOnInit(): void {
  }

  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
  }

}
