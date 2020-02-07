import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'cr-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit {

  @Input()
  public isLoading: boolean;

  @Input()
  public text: string;

  constructor() { }

  ngOnInit() {
  }

}
