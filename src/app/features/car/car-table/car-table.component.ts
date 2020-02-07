import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Car } from '../../../../generated';
import { CarService } from '../../../../generated/api/car.service';
import { Subject } from 'rxjs';
import { DateService } from '../../../core/date/date-service';
import { CsvService } from '../../../core/csv/csv-service';

@Component({
  selector: 'cr-car-table',
  templateUrl: './car-table.component.html',
  styleUrls: ['./car-table.component.scss']
})
export class CarTableComponent implements OnInit, OnDestroy {

  public title = 'Autoliste';
  public carList: MatTableDataSource<Car>;

  public displayedColumns = ['action', 'idCar', 'carMake', 'carType', 'carName', 'fee'];

  public isLoading: boolean;

  private _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator, {static: false})
  public paginator: MatPaginator;

  @ViewChild(MatSort, {static: false})
  public sort: MatSort;

  constructor(private carService: CarService,
              private csvService: CsvService) {

  }

  public ngOnInit() {
    this._loadData();
  }

  private _loadData() {
    this.isLoading = true;
    this.carService.readAllCars()
      .subscribe((carList: Car[]) => {
        this.carList = new MatTableDataSource(carList);
        this.carList.paginator = this.paginator;
        this.carList.sortingDataAccessor = (car: Car, property: string) => {
          switch (property) {
            case 'carMake': return car.carMake.carMake;
            case 'carType': return car.carType.carType;
            default: return car[property];
          }
        };
        this.carList.sort = this.sort;
        this.isLoading = false;
      });
  }

  public fuzzySearch(search: string) {
    this.carList.filter = search.trim().toLowerCase();
  }

  public exportCsv() {
    const headers = ['ID', 'Marke', 'Typ', 'Name', 'Gebühr'];
    const keys = this.displayedColumns.filter((val: string) => val !== 'aktion');
    const dataTypes = ['number', 'string', 'string', 'string', 'number'];
    const filename = this.title + '_' +  DateService.formatDateFile(new Date());
    this.csvService.exportCsvFile(headers, keys, this.carList.filteredData, dataTypes, filename);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
