import { Component, Inject, inject, OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/Services/api.service';
import { ModalService } from 'src/app/modal/modal.service';
import { DueñosModel } from 'src/app/models/dueñosModel';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form-duenos',
  templateUrl: './form-duenos.component.html',
  styleUrls: ['./form-duenos.component.css']
})
export class FormDuenosComponent implements OnInit{
  private fb = inject(FormBuilder);
  duenoForm = this.fb.group({
    Nombre: [null, [Validators.required]],
    Apellido: [null, [Validators.required]],
    Direccion: [null, [Validators.required]],
    Telefono: [null, [Validators.required, Validators.min(1000000000)]],
    CorreoElectronico: [null, [Validators.required, Validators.pattern('^[^@]+@[^@]+\.[a-zA-Z]{2,}$')]],
    Ocupacion: [null, [Validators.required]],
  });

  constructor( public dialog: MatDialog, public apiService:ApiService, public modalService: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: any){
      if (data) {
        this.duenoForm.setValue({
          Nombre: data.nombreDueño,
          Apellido: data.apellidoDueño,
          CorreoElectronico: data.correoElectronico,
          Direccion: data.direccionDueño,
          Ocupacion: data.ocupacion,
          Telefono: data.telefonoDueño,
        });
        console.log(data)
        this.idData = data.idDueño;
        this.titulo = this.modalService.titulo;
        this.acciones = this.modalService.acciones.value;
      }
    }

  infoDueno: DueñosModel = {
    NombreDueño:"",
    ApellidoDueño:"",
    DireccionDueño:"",
    TelefonoDueño:"",
    CorreoElectronico:"",
    Ocupacion:"",
  };

  titulo = ""
  acciones = ""
  idData = "";

  ngOnInit(): void {
    this.titulo = this.modalService.titulo
    this.acciones = this.modalService.acciones.value
  }

  onSubmit(): void {
    this.titulo = this.modalService.titulo
    this.acciones = this.modalService.acciones.value

    if (this.duenoForm.valid) {
      this.infoDueno.NombreDueño = this.duenoForm.controls['Nombre'].value;
      this.infoDueno.ApellidoDueño = this.duenoForm.controls['Apellido'].value;
      this.infoDueno.DireccionDueño = this.duenoForm.controls['Direccion'].value;
      this.infoDueno.TelefonoDueño = String(this.duenoForm.controls['Telefono'].value);
      this.infoDueno.CorreoElectronico = this.duenoForm.controls['CorreoElectronico'].value;
      this.infoDueno.Ocupacion = this.duenoForm.controls['Ocupacion'].value;

      this.dialog.closeAll();
      if (this.acciones == "Editar") {

        var editDueño = {
          NombreDueño: this.infoDueno.NombreDueño,
          ApellidoDueño: this.infoDueno.ApellidoDueño,
          DireccionDueño: this.infoDueno.DireccionDueño,
          TelefonoDueño: this.infoDueno.TelefonoDueño,
          CorreoElectronico: this.infoDueno.CorreoElectronico,
          Ocupacion: this.infoDueno.Ocupacion,
          IdDueño: this.idData,
        }

        this.apiService.update('DueñosMascota', editDueño, this.idData).then(res => {
          if (res == undefined) {
            Swal.fire({
              title: 'Edicion Realizada',
              text: 'El dueño ha sido actualizado ',
              icon: 'success',
              color: '#716add',
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            })
          }
        }).catch(error => {
          Swal.fire(
            `Status error ${error.status}`,
            `Message: ${error.message}`,
            `error`
          )
        })
        } else if (this.acciones == "Crear") {
        this.apiService.post('DueñosMascota', this.infoDueno).then(res=>{
          if (res == undefined) {
            Swal.fire({
              title: 'Creacion Realizada',
              text: 'El dueño ha sido creado',
              icon: 'success',
              color: '#7b1fa2',
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            })
          }
        }).catch(error=>{
          Swal.fire(
            `Status error ${error.status}`,
            `Message: ${error.message}`,
            `error`
          )
        })
      }
    }else{
      Swal.fire(
        'Ingresar los datos',
        'Por favor ingrese todos los campos requeridos',
        'error'
      )
    }
  }
}
