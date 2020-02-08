import { Component, OnInit } from '@angular/core';

import localeDECH from '@angular/common/locales/de-CH';
import { registerLocaleData } from '@angular/common';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Menu } from './menu';
import { environment } from '../environments/environment';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MenuService } from './core/menu/menu-service';

registerLocaleData(localeDECH);

@Component({
  selector: 'cr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [trigger('fade', [
    transition('void => *',
      [
        query(':enter', [
          style({
            opacity: '0'
          }),
          stagger(30, [
            animate('300ms ease-in', style({opacity: 1}))
          ])
        ])
      ]), transition('* => void', animate('300ms ease-out', style({opacity: 0})))])]
})

export class AppComponent implements OnInit {
  public isNavOpen = true;
  public activeMenu: Menu;
  public version: string;
  public activeColor = {backgroundColor: '#dcdcdc'};

  public menuList: Menu[];

  constructor(private router: Router,
              private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer,
              private menuService: MenuService) {
  }

  ngOnInit() {
    this.menuService.menuList.subscribe((menuList: Menu[]) => {
      this.menuList = menuList;
      this.menuService.activeMenu.next(this.menuList[0]);
    });
    this.menuService.activeMenu.subscribe((menu: Menu) => {
      this.activeMenu = menu;
    });
    this.version = environment.version;
    this._registerIcons();
    this.router.events.subscribe((routerEvent: RouterEvent) => {
      if (routerEvent instanceof NavigationStart) {
        const route = routerEvent.url.split('/')[1];
        if (route) {
          this.menuService.activeMenu.next(this.menuList.find((menu: Menu) => menu.route === route));
        }
      }
    });
  }

  _registerIcons() {
    this.iconRegistry.addSvgIcon('download', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/download.svg'));
  }

}
