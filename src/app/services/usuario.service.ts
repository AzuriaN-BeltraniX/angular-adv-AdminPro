import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from "rxjs/operators";
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment.prod';

import { RegisterForm } from '../interfaces/registerForm.interfaces';
import { LoginForm } from '../interfaces/loginForm.interface';
import { Usuario } from '../models/usuario.model';

// Define una variable que tiene como valor el url para las peticiones:
const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {

    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }
  get userID(): string {
    return this.usuario.userID || '';
  }

  googleInit() {
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '331710987668-moju7h7te2ji086tf53or5qjl2gp4ivr.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    })
  }

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    });
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        const { email, google, nombre, role, img = '', userId} = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, userId);
        // console.log(resp);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    // console.log('Creando Usuario...');
    return this.http.post(`${base_url}/users`, formData)
      .pipe(
        tap((resp: any) => {
          // console.log(resp)
          localStorage.setItem('token', resp.token)
        })
      )
  }

  actualizarPerfil(data: {email: string, nombre: string, role: string}) {
    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/users/${this.userID}`, data, {
      headers: {
        'x-token': this.token
      }
    });
  }

  login(formData: LoginForm) {
    // console.log('Iniciando sesión...');
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          // console.log(resp)
          localStorage.setItem('token', resp.token)
        })
      )
  }

  loginGoogle(token) {
    // console.log('Iniciando sesión con Google...');
    return this.http.post(`${ base_url }/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          // console.log('respuesta', resp)
          localStorage.setItem('token', resp.token )
        })
      );
  }

}
