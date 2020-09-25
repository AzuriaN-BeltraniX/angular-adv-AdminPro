import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { tap, map, catchError, delay } from "rxjs/operators";
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment.prod';

import { RegisterForm } from '../interfaces/registerForm.interfaces';
import { LoginForm } from '../interfaces/loginForm.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

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
    // console.log('getUserID Service', this.usuario);
    return this.usuario.userID || '';
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }
  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
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
        // console.log(resp);
        const { email, google, nombre, role, img = '', userID} = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, userID);

        this.guardarLocalStorage(resp.token, resp.menu);

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
          this.guardarLocalStorage(resp.token, resp.menu);
        })
      )
  }

  actualizarPerfil(data: {email: string, nombre: string, role: string}) {
    // data = {
    //   ...data,
    //   role: this.usuario.role
    // };

    return this.http.put(`${base_url}/users/${this.userID}`, data, this.headers);
  }

  login(formData: LoginForm) {
    // console.log('Iniciando sesión...');
    return this.http.post(`${base_url}/login`, formData)
      .pipe(tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
        // console.log(resp);
      }
    ));
  }

  loginGoogle(token) {
    // console.log('Iniciando sesión con Google...');
    return this.http.post(`${ base_url }/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          // console.log('respuesta', resp)
          this.guardarLocalStorage(resp.token, resp.menu);
        })
      );
  }

  cargarUsuario(desde: number = 0) {
    const url = `${base_url}/users?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        // delay(750),
        map(resp => {
          // console.log(resp);
          const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.userID)
          );
          
          return {
            total: resp.total,
            usuarios
          };
        })
      )
  }

  eliminarUsuario(usuario: Usuario) {
    // console.log('eliminando');
    console.log(usuario);
    
    const url = `${base_url}/users/${usuario.userID}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {
    // console.log(usuario);
    
    return this.http.put(`${base_url}/users/${usuario.userID}`, usuario, this.headers);
  }

}
