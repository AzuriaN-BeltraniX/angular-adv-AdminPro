import { Component, OnInit } from '@angular/core';
import { rejects } from 'assert';

@Component({
  selector: 'app-promises',
  templateUrl: './promises.component.html',
  styles: [
  ]
})
export class PromisesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then(usuarios => {
      console.log(usuarios);
    });

    // const promesa = new Promise( (resolve, reject) => {
    //   if (false) {
    //     resolve('Hola Mundo');
    //   } else {
    //     reject('Algo salió mal ...');
    //   }

    // });

    // promesa.then( (mensaje) => {
    //   console.log(mensaje);
    // })
    // .catch(err => console.log('Error en la promesa', err));

  }

  getUsuarios() {
    const promesa = new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then(res => res.json())
        .then(body => resolve(body.data));
    });
    return promesa;
  }

}
