import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from "sweetalert2";

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public formSubmitted = false;

  public registerForm = this.formBuilder.group({
    nombre: ['AzuriaN BeltraniX', [Validators.required, Validators.minLength(3)]],
    email: ['adm3729@azurianbeltranix.com', [Validators.required, Validators.email]],
    password: ['123456789', [Validators.required, Validators.minLength(8)]],
    password2: ['123456789', [Validators.required, Validators.minLength(8)]],
    terminos: [true, Validators.required]
  }, {
    validators: this.passwordsMatch('password', 'password2')
  });

  constructor(private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router) { }

  crearUsuario(){
    this.formSubmitted = true;
    console.log(this.registerForm.value);

    if (this.registerForm.invalid) {
      return;
    }

    // Envío de datos para la creación de Usuarios
    this.usuarioService.crearUsuario(this.registerForm.value)
      .subscribe(resp => {
        // Navega a la página principal:
        this.router.navigateByUrl('/dashboard');
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Usuario creado exitosamente!',
          showConfirmButton: false,
          timer: 1750
        })
      }, (err) => {
        // console.warn(' ' + err.error.msg);

        // Si no se puede crear el usuario, entonces:
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.error.msg,
          showConfirmButton: false,
          timer: 1750
        })
      });
  }

  campoNoValido(campo: string): boolean {
    if (this.registerForm.get(campo).invalid && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  invalidPasswords() {
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if ((pass1 !== pass2) && this.formSubmitted) {
      return true;
    } else {
      return false;
    }
  }
  aceptaTerminos() {
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }
  passwordsMatch(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if (pass1Control.value === pass2Control.value) {
        pass2Control.setErrors(null)
      } else {
        pass2Control.setErrors({noEsIgual: true})
      }
    }
  }
}
