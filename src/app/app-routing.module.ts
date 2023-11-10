import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComidasComponent } from './Components/comidas/comidas.component';
import { MascotasComponent } from './Components/mascotas/mascotas.component';
import { DuenosComponent } from './Components/duenos/duenos.component';

const routes: Routes = [
  { path: "", component:ComidasComponent},
  { path: "Comidas", component:ComidasComponent},
  { path: "Mascotas", component:MascotasComponent},
  { path: "Duenos", component:DuenosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
