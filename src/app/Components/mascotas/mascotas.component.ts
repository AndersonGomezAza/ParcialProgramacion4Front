import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/Services/api.service';
import { FormMascotasComponent } from '../forms/form-mascotas/form-mascotas.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mascotas',
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.css']
})
export class MascotasComponent {
  displayedColumns: string[] = ['nombreMascota', 'razaMascota', 'sexoMascota', 'colorMascota', 'pesoMascota', 'acciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnHeaders = {
    nombreMascota: 'Nombre',
    razaMascota: 'Raza',
    sexoMascota: 'Sexo',
    colorMascota: 'Color',
    pesoMascota: 'Peso',
    acciones: 'Acciones',
  };

  constructor(public apiService: ApiService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.apiService.Get("Mascotas").then((res)=>{
      this.dataSource.data = res;
    });
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = "Elementos por pagina";
    this.dataSource.paginator= this.paginator;
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
    this.dialog.open(FormMascotasComponent, {
      width: '60%',
    });
  }

  removerMascota(mascota) {
    Swal.fire({
      title: 'Estas seguro que quieres eliminar la mascota?',
      text: "No puedes deshacer esta operacion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.delete('Mascotas', mascota.idMascota).then(res=>{this.ngOnInit()})
        Swal.fire(
          'Mascota Eliminada!',
          'Tu registro se ha eliminado',
          'success'
        )
      }
    })
  }
}
