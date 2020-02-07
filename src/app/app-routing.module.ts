import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome.component';


const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'customer', loadChildren: () => import('./features/customer/customer.module').then(m => m.CustomerModule)},
  {path: 'car', loadChildren: () => import('./features/car/car.module').then(m => m.CarModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
