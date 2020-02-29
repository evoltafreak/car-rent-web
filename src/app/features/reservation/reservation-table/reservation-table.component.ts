import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Reservation } from '../../../../generated';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CsvService } from '../../../core/csv/csv-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';
import { DateService } from '../../../core/date/date-service';
import { ReservationService } from '../../../../generated/api/reservation.service';

@Component({
  selector: 'cr-reservation-table',
  templateUrl: './reservation-table.component.html',
  styleUrls: ['./reservation-table.component.scss']
})
export class ReservationTableComponent implements OnInit, OnDestroy {

  public title = 'Reservationsliste';

  public reservationList: MatTableDataSource<Reservation>;

  public displayedColumns = ['action', 'idReservation', 'days', 'price', 'reservationNr', 'pickUpDate', 'isLease', 'firstname', 'lastname', 'carName', 'carNr'];

  public isLoading: boolean;

  public isFooter: boolean;

  private _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator)
  public paginator: MatPaginator;

  @ViewChild(MatSort)
  public sort: MatSort;

  constructor(private reservationService: ReservationService,
              private csvService: CsvService,
              private snackBar: MatSnackBar) {

  }

  public ngOnInit() {
    this._loadData();
  }

  private _loadData() {
    this.isLoading = true;
    this.reservationService.readAllReservation()
      .pipe(takeUntil(this._onDestroy))
      .subscribe((reservationList: Reservation[]) => {
        this.reservationList = new MatTableDataSource(reservationList);
        this.reservationList.paginator = this.paginator;
        this.reservationList.sortingDataAccessor = (reservation: Reservation, property: string) => {
          switch (property) {
            case 'firstname': return reservation.customer.firstname;
            case 'lastname': return reservation.customer.lastname;
            case 'carName': return reservation.car.carName;
            case 'carNr': return reservation.car.carNr;
            default: return reservation[property];
          }
        };
        this.reservationList.sort = this.sort;
        this.isLoading = false;
        this.isFooter = false;
      }, () => {
        this.snackBar.open('Reservationen laden fehlgeschlagen.', 'X', {
          panelClass: ['cr-snackbar-error']
        });
        this.isLoading = false;
        this.isFooter = true;
      });
  }

  public fuzzySearch(search: string) {
    this.reservationList.filter = search.trim().toLowerCase();
  }

  public exportCsv() {
    const headers = ['ID', 'Tage', 'Preis', 'Reservation-Nr', 'Abholdatum', 'Geleast', 'Vorname', 'Nachname', 'Autoname', 'Auto-Nr'];
    const keys = this.displayedColumns.filter((val: string) => val !== 'action');
    const dataTypes = ['number', 'number', 'number', 'string', 'datetime', 'string', 'string', 'string', 'string', 'string'];
    const filename = this.title + '_' +  DateService.formatDateFile(new Date());
    this.csvService.exportCsvFile(headers, keys, this.reservationList.filteredData, dataTypes, filename);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


}
