import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from "rxjs/operators";

import { environment } from '../../environments/environment.prod';

import { Medico } from '../models/doctors.model';

// Define una variable que tiene como valor el url para las peticiones:
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarMedicos() {
    const url = `${base_url}/doctors`;
      return this.http.get(url, this.headers)
        .pipe(
          map( ((resp: {ok: boolean, medicos: Medico[]}) => resp.medicos))
        );
  }
  obtenerMedicoPorId(id: string) {
    const url = `${base_url}/doctor/${id}`;
    return this.http.get(url, this.headers)
      .pipe(
        map( ((resp: {ok: boolean, medico: Medico}) => resp.medico))
      );
  }
  crearMedico(medico: {hospital: string, nombre: string}) {
    const url = `${base_url}/doctors`;
      return this.http.post(url, medico, this.headers);
  }
  acualizarMedico(medico: Medico) {
    const url = `${base_url}/doctors/${medico._id}`;
      return this.http.put(url, medico, this.headers);
  }
  borrarMedico(_id: string) {
    const url = `${base_url}/doctors/${_id}`;
      return this.http.delete(url, this.headers);
  }
}
