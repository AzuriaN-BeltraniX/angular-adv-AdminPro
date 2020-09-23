import { Hospital } from './hospitals.model';

interface _DoctorUser {
    _id: string;
    nombre: string;
    img: string
}

export class Medico {

    constructor(
        public nombre: string,
        public _id?: string,
        public img?: string,
        public usuario?: _DoctorUser,
        public hospital?: Hospital
    ) {}

}