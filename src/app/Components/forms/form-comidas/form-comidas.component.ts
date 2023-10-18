import { Component, inject } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/Services/api.service';
import { ComidasModel } from 'src/app/models/comidasModel';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form-comidas',
  templateUrl: './form-comidas.component.html',
  styleUrls: ['./form-comidas.component.css']
})
export class FormComidasComponent {
  private fb = inject(FormBuilder);
  comidaForm = this.fb.group({
    Nombre: [null, [Validators.required]],
    Descripcion: [null, [Validators.required]],
    Tipo: [null, [Validators.required, Validators.maxLength(50)]],
    Precio: [null, [Validators.required, Validators.pattern('^[0-9]+[^.]')]],
    Calorias: [null, [Validators.required, Validators.max(500)]],
  });

  constructor( public dialog: MatDialog, public apiService:ApiService){}

  infoComida: ComidasModel = {
    NombreComida:"",
    DescripcionComida:"",
    TipoComida:"",
    PrecioComida:0,
    CaloriasComida:0,
  };

  onSubmit(): void {
    if (this.comidaForm.valid) {
      this.infoComida.NombreComida = this.comidaForm.controls['Nombre'].value;
      this.infoComida.DescripcionComida = this.comidaForm.controls['Descripcion'].value;
      this.infoComida.TipoComida = this.comidaForm.controls['Tipo'].value;
      this.infoComida.PrecioComida = this.comidaForm.controls['Precio'].value;
      this.infoComida.CaloriasComida = this.comidaForm.controls['Calorias'].value;

      this.dialog.closeAll();
      this.apiService.post('Comidas', this.infoComida).then(res=>{
        if (res == undefined) {
          Swal.fire({
            title: 'Creacion Realizada',
            text: 'La comida ha sido creada',
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
