import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Car, Customer, CustomerService } from '../../../../generated';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CsvService } from '../../../core/csv/csv-service';
import { DateService } from '../../../core/date/date-service';

@Component({
  selector: 'cr-customer-list',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss']
})
export class CustomerTableComponent implements OnInit, OnDestroy {

  public title = 'Kundenliste';

  public customerList: MatTableDataSource<Customer>;

  public displayedColumns = ['action', 'idCustomer', 'firstname', 'lastname', 'place', 'zipCode', 'address', 'addressNr'];

  public isLoading: boolean;

  public isFooter: boolean;

  private _onDestroy = new Subject<void>();

  @ViewChild(MatPaginator)
  public paginator: MatPaginator;

  @ViewChild(MatSort)
  public sort: MatSort;

  constructor(private customerService: CustomerService,
              private csvService: CsvService,
              private snackBar: MatSnackBar) {

  }

  public ngOnInit() {
    this._loadData();
  }

  private _loadData() {
    this.isLoading = true;
    this.customerService.readAllCustomers()
      .pipe(takeUntil(this._onDestroy))
      .subscribe((customerList: Customer[]) => {
        this.customerList = new MatTableDataSource(customerList);
        this.customerList.paginator = this.paginator;
        this.customerList.sortingDataAccessor = (customer: Customer, property: string) => {
          switch (property) {
            case 'place': return customer.place.place;
            case 'zipCode': return customer.place.zipCode;
            default: return customer[property];
          }
        };
        this.customerList.sort = this.sort;
        this.isLoading = false;
        this.isFooter = false;
      }, () => {
        this.snackBar.open('Kunden laden fehlgeschlagen.', 'X', {
          panelClass: ['cr-snackbar-error']
        });
        this.isLoading = false;
        this.isFooter = true;
      });
  }

  public fuzzySearch(search: string) {
    this.customerList.filter = search.trim().toLowerCase();
  }

  public exportCsv() {
    const headers = ['ID', 'Vorname', 'Nachname', 'Ort', 'PLZ', 'Adresse', 'Adresse Nr.'];
    const keys = this.displayedColumns.filter((val: string) => val !== 'aktion');
    const dataTypes = ['number', 'string', 'string', 'string', 'number', 'string', 'number'];
    const filename = this.title + '_' +  DateService.formatDateFile(new Date());
    this.csvService.exportCsvFile(headers, keys, this.customerList.filteredData, dataTypes, filename);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
