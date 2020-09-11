import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class ModalImageService {

  private _ocultarModal: boolean = true;
  public tipo: 'users'|'doctors'|'hospitals'; 
  public id: string; 
  public img: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal() {
    return this._ocultarModal;
  }

  abrirModal(tipo: 'users'|'doctors'|'hospitals', id: string, img: string = 'noImage') {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    // this.img = img;
    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${tipo}/${img}`
    }
  }
  cerrarModal() {
    this._ocultarModal = true;
  }

  constructor() { }
}
