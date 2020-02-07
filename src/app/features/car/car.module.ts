import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CarTableComponent } from './car-table/car-table.component';
import { CarDetailComponent } from './car-detail/car-detail.component';
import { CarRoutingModule } from './car-routing.module';

@NgModule({
  declarations: [
    CarTableComponent,
    CarDetailComponent
  ],
  imports: [
    SharedModule,
    CarRoutingModule
  ]
})
export class CarModule { }
