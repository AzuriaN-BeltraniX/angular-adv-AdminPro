import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UsuarioService } from '../../services/usuario.service';
import { FileUploadsService } from '../../services/file-uploads.service';

import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public profileForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadsService: FileUploadsService) {
    
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
      role: [this.usuario.role],
    });
    // console.log(this.profileForm);
    
  }

  actualizarPerfil() {
    // console.log(this.profileForm.value);

    this.usuarioService.actualizarPerfil(this.profileForm.value)
      .subscribe(resp => {
        // console.log(resp);
        const { nombre, email } = this.profileForm.value;

        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Perfect',
          text: 'Changes save successed!',
          showConfirmButton: false,
          timer: 1750
        });
      }, (err) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Oh no...',
          text: err.error,
          showConfirmButton: false,
          timer: 1750
        });
        console.log(err);
      });
  }

  subirImagen(file: File) {
    // console.log(file);
    this.imagenSubir = file;

    if (!file) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log(reader.result);
    }
  }

  hayImagen() {
    const image = this.imagenSubir.name;
    const ohNo: string = 'there is no image...';

    if (image === '') {
      return ohNo;
    } else {
      return image;
    }
  }

  uploadAvatar() {
    this.fileUploadsService
      .actualizarImagen(this.imagenSubir, 'users', this.usuario.userID)
      // .then(img => console.log(img))
      .then(img => {
        this.usuario.img = img;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Perfect',
          text: 'Avatar save successed!',
          showConfirmButton: false,
          timer: 1750
        });
      }).catch(err => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Oh no...',
          text: 'Try Again Later :)',
          showConfirmButton: false,
          timer: 1750
        });
      })
  }

}
