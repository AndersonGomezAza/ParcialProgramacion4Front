import { Component, inject } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/Services/api.service';
import { MascotasModel } from 'src/app/models/mascotasModel';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form-mascotas',
  templateUrl: './form-mascotas.component.html',
  styleUrls: ['./form-mascotas.component.css']
})
export class FormMascotasComponent {
  private fb = inject(FormBuilder);
  mascotaForm = this.fb.group({
    Nombre: [null, [Validators.required]],
    Raza: [null, [Validators.required]],
    Sexo: [null, [Validators.required]],
    Color: [null],
    Peso: [null, [Validators.required]],
  });

  constructor( public dialog: MatDialog, public apiService:ApiService){}

  infoMascota: MascotasModel = {
    NombreMascota:"",
    RazaMascota:"",
    SexoMascota:"",
    ColorMascota:"",
    PesoMascota:0,
  };

  onSubmit(): void {
    if (this.mascotaForm.valid) {
      this.infoMascota.NombreMascota = this.mascotaForm.controls['Nombre'].value;
      this.infoMascota.RazaMascota = this.mascotaForm.controls['Raza'].value;
      this.infoMascota.SexoMascota = this.mascotaForm.controls['Sexo'].value;
      this.infoMascota.ColorMascota = this.mascotaForm.controls['Color'].value;
      this.infoMascota.PesoMascota = this.mascotaForm.controls['Peso'].value;

      this.dialog.closeAll();
      this.apiService.post('Mascotas', this.infoMascota).then(res=>{
        if (res == undefined) {
          Swal.fire({
            title: 'Creacion Realizada',
            text: 'la mascota ha sido creada',
            icon: 'success',
            color: '#7b1fa2',
          })
        }
      }).catch(error=>{
        Swal.fire(
          `Status error ${error.status}`,
          `Message: ${error.message}`,
          `error`
        )
      })
    }else{
      Swal.fire(
        'Ingresar los datos',
        'Por favor ingrese todos los campos requeridos',
        'error'
      )
    }
  }
}
