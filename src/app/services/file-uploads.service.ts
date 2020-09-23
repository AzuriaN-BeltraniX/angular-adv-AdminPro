import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadsService {

  constructor() { }

  async actualizarImagen(
    archivo: File,
    tipo: 'users'|'doctors'|'hospitals',
    userID: string
  ) {
    try {
      const url = `${base_url}/upload/${tipo}/${userID}`
      const formData = new FormData();
      formData.append('image', archivo);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      // console.log(data);
      

      if (data.ok) {
        return data.nomArchivo;
      } else {
        console.log(data.msg);
        return false;
      }
      

      // console.log(data);
      // return 'nombre de la imagen'

    } catch (error) {
      console.log(error);
      return false;
    }
  }

}
