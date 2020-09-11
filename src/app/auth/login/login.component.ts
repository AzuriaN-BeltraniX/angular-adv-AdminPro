import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from "sweetalert2";

declare const gapi: any;

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.formBuilder.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    remember:[localStorage.getItem('remember') || false]
  });

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private usuarioService: UsuarioService,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    this.renderButton();
  }

  login() {
    // console.log(this.loginForm.value);
    // this.router.navigateByUrl('/dashboard');

    this.usuarioService.login(this.loginForm.value)
      .subscribe(resp => {
        // console.log(resp);

        // Si el ususario desea recordar su email, entonces:
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
          localStorage.setItem('remember', this.loginForm.get('remember').value);
        } else { // Si no, entonces
          localStorage.removeItem('email');
          localStorage.removeItem('remember');
        }

        // Navega a la página principal:
        this.router.navigateByUrl('/dashboard');
      }, (err) => {
        // console.warn(' ' + err.error.msg);

        // Si no encuentra el usuario, entonces:
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.error.msg,
          showConfirmButton: false,
          timer: 1750
        })
      });
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'heigth': 50,
      'longtitle': true,
      'theme': 'dark'
    });

    this.startApp();
  }

  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    
    this.attachSignin(document.getElementById('my-signin2'));
  };

  attachSignin(element) {
    // console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser) => {
          const id_token = googleUser.getAuthResponse().id_token;
          // console.log(id_token);
          this.usuarioService.loginGoogle(id_token).subscribe(resp => {
            // Navega a la página principal:
            this.ngZone.run(() => {
              this.router.navigateByUrl('/dashboard');
            })
          });

        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}