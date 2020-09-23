import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, tipo: 'users'|'hospitals'|'doctors'): unknown {
    // return `Hola Mundo: ${img} - ${tipo}`;

    if(!img) {
        return `${base_url}/upload/users/noImage`;
    } else if (img.includes('https')) {
        return img;
    } else if (img) {
        return `${base_url}/upload/${tipo}/${img}`;
    } else {
        return `${base_url}/upload/${tipo}/noImage`;
    }
  }

}
