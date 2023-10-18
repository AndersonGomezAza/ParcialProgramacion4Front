import { Component, inject } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/Services/api.service';
import { DueñosModel } from 'src/app/models/dueñosModel';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form-duenos',
  templateUrl: './form-duenos.component.html',
  styleUrls: ['./form-duenos.component.css']
})
export class FormDuenosComponent {
  private fb = inject(FormBuilder);
  duenoForm = this.fb.group({
    Nombre: [null, [Validators.required]],
    Apellido: [null, [Validators.required]],
    Direccion: [null, [Validators.required]],
    Telefono: [null, [Validators.required]],
    CorreoElectronico: [null, [Validators.required, Validators.pattern('^[^@]+@[^@]+\.[a-zA-Z]{2,}$')]],
    Ocupacion: [null, [Validators.required]],
  });

  constructor( public dialog: MatDialog, public apiService:ApiService){}

  infoDueno: DueñosModel = {
    NombreDueño:"",
    ApellidoDueño:"",
    DireccionDueño:"",
    TelefonoDueño:"",
    CorreoElectronico:"",
    Ocupacion:"",
  };

  onSubmit(): void {
    if (this.duenoForm.valid) {
      this.infoDueno.NombreDueño = this.duenoForm.controls['Nombre'].value;
      this.infoDueno.ApellidoDueño = this.duenoForm.controls['Apellido'].value;
      this.infoDueno.DireccionDueño = this.duenoForm.controls['Direccion'].value;
      this.infoDueno.TelefonoDueño = String(this.duenoForm.controls['Telefono'].value);
      this.infoDueno.CorreoElectronico = this.duenoForm.controls['CorreoElectronico'].value;
      this.infoDueno.Ocupacion = this.duenoForm.controls['Ocupacion'].value;

      this.dialog.closeAll();
      this.apiService.post('DueñosMascota', this.infoDueno).then(res=>{
        if (res == undefined) {
          Swal.fire({
            title: 'Creacion Realizada',
            text: 'El dueño ha sido creado',
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
