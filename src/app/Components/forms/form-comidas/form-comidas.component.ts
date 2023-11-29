import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/Services/api.service';
import { ModalService } from 'src/app/modal/modal.service';
import { ComidasModel } from 'src/app/models/comidasModel';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-form-comidas',
  templateUrl: './form-comidas.component.html',
  styleUrls: ['./form-comidas.component.css']
})
export class FormComidasComponent implements OnInit{
  private fb = inject(FormBuilder);
  comidaForm = this.fb.group({
    Nombre: [null, [Validators.required]],
    Descripcion: [null, [Validators.required]],
    Tipo: [null, [Validators.required, Validators.maxLength(50)]],
    Precio: [null, [Validators.required, Validators.pattern('^[0-9]+[^.]'), Validators.min(0)]],
    Calorias: [null, [Validators.required, Validators.max(500)]],
  });

  constructor( public dialog: MatDialog, public apiService:ApiService, public modalService: ModalService,
    @Inject(MAT_DIALOG_DATA) public data: any){
      if (data) {
        this.comidaForm.setValue({
          Nombre: data.nombreComida,
          Descripcion: data.descripcionComida,
          Tipo: data.tipoComida,
          Precio: data.precioComida,
          Calorias: data.caloriasComida,
        });
        console.log(data)
        this.idData = data.idComida;
        this.titulo = this.modalService.titulo;
        this.acciones = this.modalService.acciones.value;
      }
    }

  infoComida: ComidasModel = {
    NombreComida:"",
    DescripcionComida:"",
    TipoComida:"",
    PrecioComida:0,
    CaloriasComida:0,
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

    if (this.comidaForm.valid) {
      this.infoComida.NombreComida = this.comidaForm.controls['Nombre'].value;
      this.infoComida.DescripcionComida = this.comidaForm.controls['Descripcion'].value;
      this.infoComida.TipoComida = this.comidaForm.controls['Tipo'].value;
      this.infoComida.PrecioComida = this.comidaForm.controls['Precio'].value;
      this.infoComida.CaloriasComida = this.comidaForm.controls['Calorias'].value;

      this.dialog.closeAll();

      if (this.acciones == "Editar") {

        var editComida = {
          NombreComida: this.infoComida.NombreComida,
          DescripcionComida: this.infoComida.DescripcionComida,
          TipoComida: this.infoComida.TipoComida,
          PrecioComida: this.infoComida.PrecioComida,
          CaloriasComida: this.infoComida.CaloriasComida,
          IdComida: this.idData,
        }

        this.apiService.update('Comidas', editComida, this.idData).then(res => {
          if (res == undefined) {
            Swal.fire({
              title: 'Edicion Realizada',
              text: 'La comida ha sido actualizada ',
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
        this.apiService.post('Comidas', this.infoComida).then(res=>{
          if (res == undefined) {
            Swal.fire({
              title: 'Creacion Realizada',
              text: 'La comida ha sido creada',
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
