import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { Menu } from '../../menu';

@Injectable({providedIn: 'root'})
export class MenuService {

  public activeMenu: Subject<Menu> = new BehaviorSubject({route: 'customer', label: 'Kunden', icon: 'people'});
  public menuList: Subject<Menu[]> = new BehaviorSubject([
    {route: '404', label: 'Seite nicht gefunden', icon: 'error'},
    {route: 'home', label: 'Home', icon: 'home'},
    {route: 'customer', label: 'Kunden', icon: 'people'},
    {route: 'car', label: 'Autos', icon: 'directions_car'},
    {route: 'reservation', label: 'Reservationen', icon: 'assignment'}
  ]);

  constructor() {
  }



}
