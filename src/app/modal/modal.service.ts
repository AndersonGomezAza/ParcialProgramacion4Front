import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ComidasModel } from "../models/comidasModel";
import { DueñosModel } from "../models/dueñosModel";
import { MascotasModel } from "../models/mascotasModel";


@Injectable({
    providedIn: 'root'
})

export class ModalService {
    comidas:ComidasModel;
    mascotas:MascotasModel;
    duenos:DueñosModel;

    titulo = "";
    acciones = new BehaviorSubject('');
    constructor(){}
}
