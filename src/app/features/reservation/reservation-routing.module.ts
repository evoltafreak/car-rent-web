import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationTableComponent } from './reservation-table/reservation-table.component';
import { ReservationDetailComponent } from './reservation-detail/reservation-detail.component';

const routes: Routes = [
  {path: '', component: ReservationTableComponent},
  {path: ':idReservation', component: ReservationDetailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule { }
