import { LOCALE_ID, NgModule } from '@angular/core';
import 'hammerjs';
import { MAT_DATE_LOCALE } from '@angular/material';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    {provide: LOCALE_ID, useValue: 'de-CH'},
    {provide: MAT_DATE_LOCALE, useValue: 'de-CH'}
  ]
})
export class CoreModule { }

