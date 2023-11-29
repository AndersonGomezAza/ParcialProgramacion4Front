import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/Services/api.service';
import { FormComidasComponent } from '../forms/form-comidas/form-comidas.component';
import Swal from 'sweetalert2';
import { ModalService } from 'src/app/modal/modal.service';

@Component({
  selector: 'app-comidas',
  templateUrl: './comidas.component.html',
  styleUrls: ['./comidas.component.css']
})
export class ComidasComponent {
  displayedColumns: string[] = ['nombreComida', 'descripcionComida', 'tipoComida', 'precioFormateado', 'caloriasComida', 'acciones'];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnHeaders = {
    nombreComida: 'Nombre',
    descripcionComida: 'Descripción',
    tipoComida: 'Tipo',
    precioFormateado: 'Precio',
    caloriasComida: 'Calorías',
    acciones: 'Acciones',
  };

  accion: string = "Crear";

  constructor(public apiService: ApiService, public dialog: MatDialog, public modalService: ModalService) {
    this.dataSource = new MatTableDataSource()
  }

  ngOnInit(): void {
    this.apiService.Get("Comidas").then((res) => {
      // Formatear los precios en pesos colombianos con separador de miles
      this.dataSource.data = res.map(item => {
        item.precioFormateado = this.formatoPrecioColombiano(item.precioComida);
        return item;
      })
    });
  }

  formatoPrecioColombiano(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(precio);
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
    this.dialog.open(FormComidasComponent, {
      width: '60%',
    });
  }

  editarComida(element: any) {
    this.modalService.acciones.next("Editar");

    this.dialog.open(FormComidasComponent, {
      height: 'auto',
      width: 'auto',
      data: element // El objeto 'element' ahora contiene los datos del dueño a editar
    });
  }

  removerComida(comida) {
    Swal.fire({
      title: 'Estas seguro que quieres eliminar la Comida?',
      text: "No puedes deshacer esta operacion",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.delete('Comidas', comida.idComida).then(res=>{this.ngOnInit()})
        Swal.fire(
          'Comida Eliminada!',
          'Tu registro se ha eliminado',
          'success'
        )
      }
    })
  }
}
