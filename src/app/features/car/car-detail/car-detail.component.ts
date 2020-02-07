import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Car } from '../../../../generated';
import { forkJoin, Subject } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { CarService } from '../../../../generated/api/car.service';
import { CarMake } from '../../../../generated/model/carMake';
import { CarType } from '../../../../generated/model/carType';

@Component({
  selector: 'cr-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss']
})
export class CarDetailComponent implements OnInit, OnDestroy {

  public strLimit = 100;

  public form: FormGroup;

  public car: Car;

  public carMakeList: CarMake[];

  public carTypeList: CarType[];

  public isLoading: boolean;

  private _onDestroy = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private carService: CarService,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {

    forkJoin([this.carService.readAllCarMakes(), this.carService.readAllCarTypes()])
      .pipe(takeUntil(this._onDestroy))
      .subscribe(([carMakeList, carTypeList]: [CarMake[], CarType[]]) => {
          this.carMakeList = carMakeList;
          this.carTypeList = carTypeList;
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
      if (params.idCar === 'new') {
        this.car = {
          carMake: {} as CarMake,
          carType: {} as CarType
        } as Car;
        this._initForm();
        this.isLoading = false;
      } else {
        this.carService.readCarById(+params.idCar)
          .pipe(takeUntil(this._onDestroy))
          .subscribe((car: Car) => {
            this.car = car;
            this._initForm();
            this.isLoading = false;
          }, () => {
            this.snackBar.open('Auto laden fehlgeschlagen.', 'X', {
              panelClass: ['cr-snackbar-error']
            });
            this.isLoading = false;
          });
      }
    });
  }

  private _initForm() {
    this.form = new FormGroup({
      idCar: new FormControl({value: this.car.idCar, disabled: true}),
      carMake: new FormControl(this.car.carMake.carMake, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      carType: new FormControl(this.car.carType.idCarType, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      carName: new FormControl(this.car.carName, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      fee: new FormControl(this.car.fee, Validators.compose([Validators.maxLength(this.strLimit), Validators.required]))
    });
  }

  public saveCar() {
    if (this.form.valid) {
      this.car.carMake.carMake = this.form.get('carMake').value;
      this.car.carType.carType = this.form.get('carType').value;
      this.car.carName = this.form.get('carName').value;
      this.car.fee = this.form.get('fee').value;
      this.carService.updateCar(this.car)
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.snackBar.open('Auto speichern erfolgreich.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-success'});
        }, () => {
          this.snackBar.open('Auto speichern fehlgeschlagen.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-error'});
        });
    }
  }

  public deleteCar() {
    this.carService.deleteCarById(this.car.idCar)
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.snackBar.open('Auto löschen erfolgreich.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-success'});
      }, () => {
        this.snackBar.open('Auto löschen fehlgeschlagen.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-error'});
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
