import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Customer, CustomerService } from '../../../../generated';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';
import { Place } from '../../../../generated/model/place';

@Component({
  selector: 'cr-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit, OnDestroy {

  public strLimit = 100;

  public form: FormGroup;

  public customer: Customer;

  public isLoading: boolean;

  private _onDestroy = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private customerService: CustomerService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this._loadData();
  }

  private _loadData() {
    this.isLoading = true;
    this.route.params.subscribe((params: Params) => {
      if (params.idCustomer === 'new') {
        this.customer = {
          place: {} as Place
        } as Customer;
        this._initForm();
        this.isLoading = false;
      } else {
        this.customerService.readCustomerById(+params.idCustomer)
          .pipe(takeUntil(this._onDestroy))
          .subscribe((customer: Customer) => {
            this.customer = customer;
            this._initForm();
            this.isLoading = false;
          }, () => {
            this.snackBar.open('Kunde laden fehlgeschlagen.', 'X', {
              panelClass: ['cr-snackbar-error']
            });
            this.isLoading = false;
          });
      }
    });
  }

  private _initForm() {
    this.form = new FormGroup({
      idCustomer: new FormControl({value: this.customer.idCustomer, disabled: true}),
      firstname: new FormControl(this.customer.firstname, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      lastname: new FormControl(this.customer.lastname, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      place: new FormControl(this.customer.place.place, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      zipCode: new FormControl(this.customer.place.zipCode, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      address: new FormControl(this.customer.address, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      addressNr: new FormControl(this.customer.addressNr, Validators.compose([Validators.maxLength(this.strLimit)])),
    });
  }

  public saveCustomer() {
    if (this.form.valid) {
      this.customer.firstname = this.form.get('firstname').value;
      this.customer.lastname = this.form.get('lastname').value;
      this.customer.place.place = this.form.get('place').value;
      this.customer.place.zipCode = this.form.get('zipCode').value;
      this.customer.address = this.form.get('address').value;
      this.customer.addressNr = this.form.get('addressNr').value;
      this.customerService.updateCustomer(this.customer)
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.snackBar.open('Kunde speichern erfolgreich.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-success'});
        }, () => {
          this.snackBar.open('Kunde speichern fehlgeschlagen.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-error'});
        });
    }
  }

  public deleteCustomer() {
    this.customerService.deleteCustomerById(this.customer.idCustomer)
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.snackBar.open('Kunde löschen erfolgreich.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-success'});
      }, () => {
        this.snackBar.open('Kunde löschen fehlgeschlagen.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-error'});
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
