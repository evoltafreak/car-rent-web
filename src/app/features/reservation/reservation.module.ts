import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReservationTableComponent } from './reservation-table/reservation-table.component';
import { ReservationRoutingModule } from './reservation-routing.module';
import { ReservationDetailComponent } from './reservation-detail/reservation-detail.component';

@NgModule({
  declarations: [
    ReservationTableComponent,
    ReservationDetailComponent
  ],
  imports: [
    SharedModule,
    ReservationRoutingModule
  ]
})
export class ReservationModule { }
