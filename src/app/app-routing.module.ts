import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { NotFoundComponent } from './features/not-found/not-found.component';


const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: WelcomeComponent},
  {path: 'customer', loadChildren: () => import('./features/customer/customer.module').then(m => m.CustomerModule)},
  {path: 'car', loadChildren: () => import('./features/car/car.module').then(m => m.CarModule)},
  {path: 'reservation', loadChildren: () => import('./features/reservation/reservation.module').then(m => m.ReservationModule)},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
