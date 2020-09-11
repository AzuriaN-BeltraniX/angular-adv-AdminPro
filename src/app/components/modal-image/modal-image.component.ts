import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { ModalImageService } from '../../services/modal-image.service';
import { FileUploadsService } from '../../services/file-uploads.service';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styleUrls: ['./modal-image.component.css']
})
export class ModalImageComponent implements OnInit {

  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(public modalImageService: ModalImageService,
              public fileUploadsService: FileUploadsService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImageService.cerrarModal();
    
    // console.log(this.ocultarModal);
    // console.log('btnCancel - funciona');
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

  uploadAvatar() {

    const id = this.modalImageService.id;
    const tipo = this.modalImageService.tipo;

    this.fileUploadsService
      .actualizarImagen(this.imagenSubir, tipo, id)
      // .then(img => console.log(img))
      .then(img => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Perfect',
          text: 'Avatar save successed!',
          showConfirmButton: false,
          timer: 1750
        });
        this.modalImageService.nuevaImagen.emit(img)
        this.cerrarModal();
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
