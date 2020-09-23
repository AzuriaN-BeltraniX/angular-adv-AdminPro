import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospitals.model';

import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private  http: HttpClient) { }

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

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.userID)
    );
  }
  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados;
  }
  private transformarDoctores(resultados: any[]): Hospital[] {
    return resultados;
  }

  buscar(tipo: 'users'|'doctors'|'hospitals', termino: string) {
    const url = `${base_url}/search/collection/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
      .pipe(
        map((resp: any) => {
          switch (tipo) {
            case 'users':
              return this.transformarUsuarios(resp.resultados)
              break;
            case 'hospitals':
              return this.transformarHospitales(resp.resultados)
              break;
            case 'doctors':
              return this.transformarDoctores(resp.resultados)
              break;
          
            default:
              break;
          }
        })
      )
  }
}
