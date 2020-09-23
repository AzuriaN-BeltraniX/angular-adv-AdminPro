import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';

import { Usuario } from 'src/app/models/usuario.model';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImageService } from '../../../services/modal-image.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription;
  public desde: number = 0;
  public loading: boolean = true;

  constructor(private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImageService: ModalImageService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImageService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => {
        // console.log(img);
        this.cargarUsuarios()
      });
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuarioService.cargarUsuario(this.desde)
      .subscribe( ({total, usuarios}) => {
        // console.log(resp);
        this.totalUsuarios = total;
        if (usuarios.length !== 0) {
          this.usuarios = usuarios;
          this.usuariosTemp = usuarios;
        }
        this.loading = false;
      })
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde > this.totalUsuarios) {
      this.desde -= valor;
    }

    this.cargarUsuarios();
  }
 
  buscar(termino: string) {
    // console.log(termino);
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar('users', termino)
      .subscribe((resultados: Usuario[]) => {
        this.usuarios = resultados;
      });
  }

  eliminarUsuario(usuario: Usuario) {
    // console.log(usuario);
    // console.log(this.usuarioService.userID);
    
    if (usuario.userID === this.usuarioService.userID) {
      return Swal.fire({
        position: 'center',
        icon: 'error',
        title: "You can't remove yourself from here...",
        showConfirmButton: false,
        timer: 2000
      })
    }
    
    // console.log('Esto no se tiene que ver...');
    // return;
    
    Swal.fire({
      title: 'Are you sure...?',
      text: 'When you remove, you will not be able to reverse the action!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp => {
            // console.log(resp);
            this.cargarUsuarios();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'User deleted successfully!',
              html: `<hr><b class="text-info">"${usuario.nombre}"</b> has been deleted<br><br>
                    <h6 class="grayColor">ID: ${usuario.userID}</h6>`,
              showConfirmButton: false,
              timer: 3000,
              onBeforeOpen: () => {
                const content = Swal.getContent()
                const b = content.querySelector('b')
              }
            })
          })
      }
    })
  }

  cambiarRole(usuario: Usuario) {
    // console.log(usuario);
    
    this.usuarioService.guardarUsuario(usuario)
      .subscribe(resp => {
        // console.log('Hola...');
        // console.log(resp);
      });
  }

  abrirModal(usuario: Usuario) {
    // console.log(usuario);
    this.modalImageService.abrirModal('users', usuario.userID, usuario.img);
  }

}
