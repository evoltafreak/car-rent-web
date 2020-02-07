import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';

@Injectable({providedIn: 'root'})
export class DateService {

  private static datePipe: DatePipe = new DatePipe('de-CH');

  constructor() {
  }

  public static formatDateFile(date: Date) {
    if (!date) { return ''; }
    return this.datePipe.transform(date, 'yyyyMMdd');
  }

}
