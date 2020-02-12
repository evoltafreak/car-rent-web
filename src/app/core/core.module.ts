import { NgModule } from '@angular/core';
import localeDECH from '@angular/common/locales/de-CH';
import { registerLocaleData } from '@angular/common';
import { BASE_PATH } from '../../generated';

// set normal apostrophe for numbers
localeDECH[13][1] = '\'';
registerLocaleData(localeDECH);

@NgModule({
  declarations: [],
  imports: [],
  providers: [{provide: BASE_PATH, useValue: 'https://localhost:5001/api'}]
})
export class CoreModule { }

