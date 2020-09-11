import { environment } from "../../environments/environment";

const base_url = environment.base_url;

export class Usuario {
    constructor (
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string, 
        public google?: boolean,
        public role?: string,
        public userID?: string
    ) {}

    imrpimirUsuario() {
        console.log(this.nombre);
    }

    get imagenUrl() {
        // /upload/users/noImage
        if(!this.img) {
            return `${base_url}/upload/users/noImage`;
        } else if (this.img.includes('https')) {
            return this.img;
        } else if (this.img) {
            return `${base_url}/upload/users/${this.img}`;
        } else {
            return `${base_url}/upload/users/noImage`;
        }
    }
}