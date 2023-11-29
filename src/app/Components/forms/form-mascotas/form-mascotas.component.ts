import { Component, Inject, inject, OnInit } from '@angular/core';

import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/Services/api.service';
import { ModalService } from 'src/app/modal/modal.service';
import { MascotasModel } from 'src/app/models/mascotasModel';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form-mascotas',
  templateUrl: './form-mascotas.component.html',
  styleUrls: ['./form-mascotas.component.css']
})
export class FormMascotasComponent implements OnInit{
  private fb = inject(FormBuilder);
  mascotaForm = this.fb.group({
    Nombre: [null, [Validators.required]],
    Raza: [null, [Validators.required]],
    Sexo: [null, [Validators.required]],
    Color: [null],
    Peso: [null, [Validators.required, Validators.min(0)]],
  });

  constructor( public dialog: MatDialog, public apiService:ApiService, public modalService: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: any){
      if (data) {
        this.mascotaForm.setValue({
          Nombre: data.nombreMascota,
          Peso: data.pesoMascota,
          Color: data.colorMascota,
          Raza: data.razaMascota,
          Sexo: data.sexoMascota,
        });
        console.log(data)
        this.idData = data.idMascota;
        this.titulo = this.modalService.titulo;
        this.acciones = this.modalService.acciones.value;
      }
    }

  infoMascota: MascotasModel = {
    NombreMascota:"",
    RazaMascota:"",
    SexoMascota:"",
    ColorMascota:"",
    PesoMascota:0,
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

    if (this.mascotaForm.valid) {
      this.infoMascota.NombreMascota = this.mascotaForm.controls['Nombre'].value;
      this.infoMascota.RazaMascota = this.mascotaForm.controls['Raza'].value;
      this.infoMascota.SexoMascota = this.mascotaForm.controls['Sexo'].value;
      this.infoMascota.ColorMascota = this.mascotaForm.controls['Color'].value;
      this.infoMascota.PesoMascota = this.mascotaForm.controls['Peso'].value;

      this.dialog.closeAll();
      if (this.acciones == "Editar") {

        var editMascota = {
          NombreMascota: this.infoMascota.NombreMascota,
          RazaMascota: this.infoMascota.RazaMascota,
          SexoMascota: this.infoMascota.SexoMascota,
          ColorMascota: this.infoMascota.ColorMascota,
          PesoMascota: this.infoMascota.PesoMascota,
          IdMascota: this.idData,
        }

        this.apiService.update('Mascotas', editMascota, this.idData).then(res => {
          if (res == undefined) {
            Swal.fire({
              title: 'Edicion Realizada',
              text: 'La mascota ha sido actualizado ',
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
        this.apiService.post('Mascotas', this.infoMascota).then(res=>{
          if (res == undefined) {
            Swal.fire({
              title: 'Creacion Realizada',
              text: 'la mascota ha sido creada',
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
