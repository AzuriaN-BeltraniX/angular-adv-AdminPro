import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { MedicoService } from '../../../services/medico.service';
import { ModalImageService } from '../../../services/modal-image.service';
import { BusquedasService } from '../../../services/busquedas.service';

import { Medico } from '../../../models/doctors.model';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit, OnDestroy {

  public loading: boolean = true;
  public medicos: Medico[] = [];
  private imgSubs: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImageService: ModalImageService,
              private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.imgSubs = this.modalImageService.nuevaImagen
    .pipe(delay(100))
    .subscribe(img => {
      // console.log(img);
      this.cargarMedicos();
    });
  }

  cargarMedicos() {
    this.loading = true;
    this.medicoService.cargarMedicos()
      .subscribe(medicos => {
        this.loading = false;
        this.medicos = medicos;
        console.log(medicos);
      })
  }

  borrarMedico(medico: Medico) {
    // console.log(medico);
    // console.log(this.usuarioService.userID);
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
        this.medicoService.borrarMedico(medico._id)
          .subscribe(resp => {
            // console.log(resp);
            this.cargarMedicos();
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Doctor deleted successfully!',
              html: `<hr><b class="text-info">"${medico.nombre}"</b> has been deleted<br><br>
                    <h6 class="grayColor">ID: ${medico._id}</h6>`,
              showConfirmButton: false,
              timer: 3000,
              onBeforeOpen: () => {
                const content = Swal.getContent()
                const b = content.querySelector('b')
              }
            });
          });
      };
    })
  }

  abrirModal(medico: Medico) {
    console.log(medico);
    this.modalImageService.abrirModal('doctors', medico._id, medico.img);
  }

  buscar(termino: string) {
    // console.log(termino);
    if (termino.length === 0) {
      return this.cargarMedicos();
    }

    this.busquedasService.buscar('doctors', termino)
      .subscribe((resultados: Medico[]) => {
        this.medicos = resultados;
      });
  }

}
