import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Car, Reservation } from '../../../../generated';
import { CarService } from '../../../../generated/api/car.service';
import { Subject } from 'rxjs';
import { DateService } from '../../../core/date/date-service';
import { CsvService } from '../../../core/csv/csv-service';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'cr-car-table',
  templateUrl: './car-table.component.html',
  styleUrls: ['./car-table.component.scss']
})
export class CarTableComponent implements OnInit, OnDestroy {

  public title = 'Autoliste';
  public carList: MatTableDataSource<Car>;

  public displayedColumns = ['action', 'idCar', 'carMake', 'carType', 'carClass', 'carName', 'fee'];

  public isLoading: boolean;

  public isFooter: boolean;

  private _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator)
  public paginator: MatPaginator;

  @ViewChild(MatSort)
  public sort: MatSort;

  constructor(private carService: CarService,
              private csvService: CsvService,
              private snackBar: MatSnackBar) {

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
      }, () => {
        this.snackBar.open('Autos laden fehlgeschlagen.', 'X', {
          panelClass: ['cr-snackbar-error']
        });
        this.isLoading = false;
        this.isFooter = true;
      });
  }

  public fuzzySearch(search: string) {
    this.carList.filter = search.trim().toLowerCase();
  }

  public deleteCar(idCar: number) {
    this.carService.deleteCarById(idCar)
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.snackBar.open('Auto löschen erfolgreich.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-success'});
        this.carList = new MatTableDataSource<Car>(this.carList.data.filter(c => c.idCar !== idCar));
      }, () => {
        this.snackBar.open('Auto löschen fehlgeschlagen.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-error'});
      });
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
