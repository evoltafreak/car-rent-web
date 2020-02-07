import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarTableComponent } from './car-table/car-table.component';
import { CarDetailComponent } from './car-detail/car-detail.component';

const routes: Routes = [
  {path: '', component: CarTableComponent},
  {path: ':idCar', component: CarDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRoutingModule { }
