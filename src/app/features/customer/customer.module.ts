import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerTableComponent } from './customer-table/customer-table.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

@NgModule({
  declarations: [
    CustomerTableComponent,
    CustomerDetailComponent
  ],
  imports: [
    SharedModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }
