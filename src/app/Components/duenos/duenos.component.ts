import { Component, ViewChild } from '@angular/core';
import { FormDuenosComponent } from '../forms/form-duenos/form-duenos.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/Services/api.service';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ModalService } from 'src/app/modal/modal.service';

@Component({
  selector: 'app-duenos',
  templateUrl: './duenos.component.html',
  styleUrls: ['./duenos.component.css']
})
export class DuenosComponent {
  displayedColumns: string[] = ['nombreDueño', 'apellidoDueño', 'direccionDueño', 'telefonoDueño', 'correoElectronico', 'ocupacion', 'acciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnHeaders = {
    nombreDueño: 'Nombres',
    apellidoDueño: 'Apellidos',
    direccionDueño: 'Dirección',
    telefonoDueño: 'Teléfono',
    correoElectronico: 'Correo',
    ocupacion: 'Ocupación',
    acciones: 'Acciones',
  };

  accion: string = "Crear";

  constructor(public apiService: ApiService, public dialog: MatDialog, public modalService: ModalService) {
    this.dataSource = new MatTableDataSource()
  }

  ngOnInit(): void {
    this.apiService.Get("DueñosMascota").then((res)=>{
      return this.dataSource.data = res;
    });
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Elementos por pagina";
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog() {
    this.modalService.acciones.next(this.accion);
    this.dialog.open(FormDuenosComponent, {
      width: '60%',
    });
  }

  editarDueno(element: any) {
    this.modalService.acciones.next("Editar");

    this.dialog.open(FormDuenosComponent, {
      height: 'auto',
      width: 'auto',
      data: element // El objeto 'element' ahora contiene los datos del dueño a editar
    });
  }

  removerDueno(dueno) {
    Swal.fire({
      title: 'Estas seguro que quieres eliminar El dueño/a?',
      text: "No puedes deshacer esta operacion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.delete('DueñosMascota', dueno.idDueño).then(res=>{this.ngOnInit()})
        Swal.fire(
          'Dueño/a Eliminada!',
          'Tu registro se ha eliminado',
          'success'
        )
      }
    })
  }
}
