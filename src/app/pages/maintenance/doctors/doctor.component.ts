import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from '../../../services/medico.service';

import { Hospital } from '../../../models/hospitals.model';
import { Medico } from '../../../models/doctors.model';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';
import { ModalImageService } from '../../../services/modal-image.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

// Define una variable que tiene como valor el url para las peticiones:
const base_url = environment.base_url;

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public medicos: Medico[] = [];
  public medicoSeleccionado: Medico;
  private imgSubs: Subscription;
  private null: null;

  constructor(private formBuilder: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private modalImageService: ModalImageService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({id}) => {
      // console.log(id);
      this.cargarMedico(id);

      this.imgSubs = this.imgSubs = this.modalImageService.nuevaImagen
      .pipe(delay(10))
      .subscribe(img => {
        // console.log(img);
        this.cargarMedico(id);
      });
    })

    this.medicoForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    });

    this.cargarHospitales();
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        // console.log(hospitales);
        this.hospitales = hospitales;
      });
  }

  cargarMedico(id: string) {
    if (id === 'new') {
      return;
    }

    this.medicoService.obtenerMedicoPorId(id)
      .subscribe(medico => {
        // console.log(medico);

        if (!medico) {
          this.router.navigateByUrl(`/maintenance/doctors`);
        }

        const { nombre, hospital:{_id} } = medico;
        // console.log(nombre, _id);
        
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({nombre, hospital: _id})

        // --- Inserta datos en la tarjeta del Doctor ---
        let imgProfile = document.getElementById('imgProfile');
        imgProfile.innerHTML = `
        <img class="img-circle cursor marginShadowWhite"
             width="100" src="${base_url}/upload/doctors/${medico.img || 'noImage'}">
        `

        let medicoNombre = document.getElementById('nameProfile');
        medicoNombre.innerHTML = `<span style="color: white; opacity: 50%;">Dr. </span>${medico.nombre || 'Doctor Name'}`;
        let hospitalNombre = document.getElementById('nameHospital');
        hospitalNombre.innerHTML = medico.hospital.nombre || 'Hospital Name';
      });
  }
  guardarMedico() {
    // console.log(this.medicoForm.value);
    const {nombre} = this.medicoForm.value;
    const {hospital} = this.medicoForm.value;
   
    this.medicoService.crearMedico(this.medicoForm.value)
    .subscribe((resp: any) => {
      // console.log(resp);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Doctor created successfully!',
        html:  `<hr>Doctor name: <b class="text-info">"${nombre}"</b> 
                <br><br>
                <h6 class="grayColor">Hospital ID: ${hospital}</h6>`,
        showConfirmButton: false,
        timer: 3000
      });
      this.router.navigateByUrl(`/maintenance/doctor/${resp.medico._id}`);
    });
  }

  actualizarMedico() {
    // console.log(this.medicoForm.value);
    // console.log(this.medicoSeleccionado._id);
    
    const {nombre} = this.medicoForm.value;
    const {hospital} = this.medicoForm.value;
    const id = this.medicoSeleccionado._id;

    const data = {
      ...this.medicoForm.value,
      _id: this.medicoSeleccionado._id
    }

    this.medicoService.acualizarMedico(data)
      .subscribe(resp => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Doctor updated successfully!',
          html:  `<hr>New doctor name: <b class="text-info">"${nombre}"</b> 
                  <br><br>
                  <h6 class="grayColor">Hospital ID: ${hospital}</h6>`,
          showConfirmButton: false,
          timer: 2750
        });
        this.cargarMedico(id);
      });
  }

  abrirModal() {
    // console.log('Abrio modal');
    this.modalImageService.abrirModal('doctors', this.medicoSeleccionado._id, this.medicoSeleccionado.img);
  }
 
}
