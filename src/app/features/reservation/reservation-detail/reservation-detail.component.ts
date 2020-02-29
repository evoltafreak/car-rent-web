import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Car, Customer, CustomerService, Reservation } from '../../../../generated';
import { forkJoin, Subject } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CarService } from '../../../../generated/api/car.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';
import { ReservationService } from '../../../../generated/api/reservation.service';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'cr-reservation-detail',
  templateUrl: './reservation-detail.component.html',
  styleUrls: ['./reservation-detail.component.scss']
})
export class ReservationDetailComponent implements OnInit, OnDestroy {

  public strLimit = 100;

  public form: FormGroup;

  public reservation: Reservation;

  public carList: Car[];

  public customerList: Customer[];

  public isLoading: boolean;

  public decimalePipe = new DecimalPipe('de-CH');

  private _onDestroy = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private reservationService: ReservationService,
              private carService: CarService,
              private customerService: CustomerService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {

    forkJoin([this.carService.readAllCars(), this.customerService.readAllCustomers()])
      .pipe(takeUntil(this._onDestroy))
      .subscribe(([carList, customerList]: [Car[], Customer[]]) => {
        this.carList = carList;
        this.customerList = customerList;
      }, () => {
        this.snackBar.open('Autos laden fehlgeschlagen.', 'X', {
          panelClass: ['cr-snackbar-error']
        });
      });

    this._loadData();
  }

  private _loadData() {
    this.isLoading = true;
    this.route.params.subscribe((params: Params) => {
      if (params.idReservation === 'new') {
        this.reservation = {
          customer: {} as Customer,
          car: {} as Car
        } as Reservation;
        this._initForm();
        this.isLoading = false;
      } else {
        this.reservationService.readReservationById(+params.idReservation)
          .pipe(takeUntil(this._onDestroy))
          .subscribe((reservation: Reservation) => {
            this.reservation = reservation;
            this._initForm();
            this.isLoading = false;
          }, () => {
            this.snackBar.open('Reservation laden fehlgeschlagen.', 'X', {
              panelClass: ['cr-snackbar-error']
            });
            this.isLoading = false;
            this.router.navigate(['/reservation']);
          });
      }
    });
  }

  private _initForm() {
    this.form = new FormGroup({
      idReservation: new FormControl({value: this.reservation.idReservation, disabled: true}),
      days: new FormControl(this.reservation.days, Validators.compose([Validators.required])),
      price: new FormControl(this.decimalePipe.transform(this.reservation.price, '1.2-2'), Validators.compose([Validators.required])),
      reservationNr: new FormControl(this.reservation.reservationNr, Validators.compose([Validators.required])),
      pickUpDate: new FormControl(this.reservation.pickUpDate, Validators.compose([Validators.required])),
      isLease: new FormControl(this.reservation.isLease, Validators.compose([Validators.required])),
      car: new FormControl(this.reservation.car.idCar, Validators.compose([Validators.required])),
      customer: new FormControl(this.reservation.customer.idCustomer, Validators.compose([Validators.required]))
    });
  }

  public saveReservation() {
    if (this.form.valid) {
      this.reservation.days = this.form.get('days').value;
      this.reservation.price = parseFloat(this.form.get('price').value);
      this.reservation.reservationNr = this.form.get('reservationNr').value;
      this.reservation.pickUpDate = this.form.get('pickUpDate').value;
      this.reservation.isLease = this.form.get('isLease').value;
      this.reservation.car = this.carList.find((car: Car) => car.idCar === this.form.get('car').value);
      this.reservation.customer = this.customerList.find((customer: Customer) => customer.idCustomer === this.form.get('customer').value);

      if (this.reservation.idReservation) {
        this.reservationService.updateReservation(this.reservation)
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.snackBar.open('Reservation speichern erfolgreich.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-success'});
          }, () => {
            this.snackBar.open('Reservation speichern fehlgeschlagen.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-error'});
          });
      } else {
        this.reservationService.addReservation(this.reservation)
          .pipe(takeUntil(this._onDestroy))
          .subscribe((idReservation: number) => {
            this.snackBar.open('Reservation speichern erfolgreich.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-success'});
            this.router.navigate(['/reservation', idReservation]);
          }, () => {
            this.snackBar.open('Reservation speichern fehlgeschlagen.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-error'});
          });
      }


    }
  }

  public deleteReservation() {
    this.reservationService.deleteReservationById(this.reservation.idReservation)
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.snackBar.open('Reservation löschen erfolgreich.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-success'});
        this.router.navigate(['/reservation']);
      }, () => {
        this.snackBar.open('Reservation löschen fehlgeschlagen.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-error'});
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
