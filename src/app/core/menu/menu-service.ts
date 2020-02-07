import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { Menu } from '../../menu';

@Injectable({providedIn: 'root'})
export class MenuService {

  public activeMenu: Subject<Menu> = new BehaviorSubject({route: 'customer', label: 'Kunden', icon: 'people'});
  public menuList: Subject<Menu[]> = new BehaviorSubject([
    {route: 'customer', label: 'Kunden', icon: 'people'},
    {route: 'car', label: 'Autos', icon: 'directions_car'}
  ]);

  constructor() {
  }



}
