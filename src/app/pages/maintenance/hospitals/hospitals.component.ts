import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from 'src/app/models/hospitals.model';

import { HospitalService } from '../../../services/hospital.service';
import { ModalImageService } from '../../../services/modal-image.service';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styleUrls: ['./hospitals.component.css']
})
export class HospitalsComponent implements OnInit, OnDestroy {

  public hospitals: Hospital[] = [];
  public loading: boolean = true;
  private imgSubs: Subscription;

  constructor(private hospitalService: HospitalService,
              private modalImageService: ModalImageService,
              private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.imgSubs = this.modalImageService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => {
        // console.log(img);
        this.cargarHospitales()
      });
  }

  cargarHospitales() {
    this.loading = true;

    this.hospitalService.cargarHospitales()
      .subscribe(hospitals => {
        // console.log(hospitals);
        this.loading = false;
        this.hospitals = hospitals;
      })
  }
  
  guardarCambios(hospital: Hospital) {
    // console.log(hospital);
    this.hospitalService.acualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        this.cargarHospitales();
        
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "Hospital Updated",
          html: `<hr> <span style="opacity: 40%;">New name:</span>
                  <span style="opacity: 70%;">
                    <b class="text-success">${hospital.nombre}</b>
                  </span>
                  <br> <br>
                  <span style="opacity: 40%; font-size: 14px;">id: ${hospital._id}</span>`,
          showConfirmButton: false,
          timer: 2200
        });
      });
  }

  eliminarHospital(hospital: Hospital) {
    console.log(hospital._id);
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
        // console.log(hospital._id);
        this.hospitalService.borrarHospital(hospital._id)
          .subscribe(resp => {
            console.log(resp);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'User deleted successfully!',
              html: `<hr><b class="text-info">"${hospital.nombre}"</b> has been deleted<br><br>
                    <h6 class="grayColor">ID: ${hospital._id}</h6>`,
              showConfirmButton: false,
              timer: 3000,
              onBeforeOpen: () => {
                const content = Swal.getContent()
                const b = content.querySelector('b')
              }
            });
          });
          this.cargarHospitales();
          console.log(hospital);
      }
      // if (result.isConfirmed) {
      //   console.log(hospital._id);
      //   console.log(hospital.nombre);
      //   Swal.fire({
      //     position: 'center',
      //     icon: 'success',
      //     title: 'User deleted successfully!',
      //     html: `<hr><b class="text-info">"${hospital.nombre}"</b> has been deleted<br><br>
      //           <h6 class="grayColor">ID: ${hospital._id}</h6>`,
      //     showConfirmButton: false,
      //     timer: 3000,
      //     onBeforeOpen: () => {
      //       const content = Swal.getContent()
      //       const b = content.querySelector('b')
      //     }
      //   });
      // }
    });


  }

  async arbirSweetAlert() {
    const {value = ''} = await Swal.fire<string>({
      title: 'Create a new Hospital',
      text: 'Please enter a name',
      input: 'text',
      inputPlaceholder: 'Name of the new hospital',
      showCancelButton: true,
      cancelButtonColor: '#d33',
    });

    // console.log(value);
    if(value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
        .subscribe((resp: any) => {
          // console.log(resp);
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: "Hospital created successfully",
            html: `<hr> <span style="opacity: 40%;">Name:</span>
                    <span style="opacity: 70%;">
                      <b class="text-success">${value}</b>
                    </span>`,
            showConfirmButton: false,
            timer: 2200
          });
          this.cargarHospitales();
        });
    }   
  }

  abrirModal(hospital: Hospital) {
    // console.log(hospital);
    this.modalImageService.abrirModal('hospitals', hospital._id, hospital.img);
  }

  buscar(termino: string) {
    // console.log(termino);
    if (termino.length === 0) {
      return this.cargarHospitales();
    }

    this.busquedasService.buscar('hospitals', termino)
      .subscribe((resultados: Hospital[]) => {
        this.hospitals = resultados;
      });
  }
}
