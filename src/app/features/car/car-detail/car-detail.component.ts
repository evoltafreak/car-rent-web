import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Car, CarClass } from '../../../../generated';
import { forkJoin, Subject } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs/operators';
import { CarService } from '../../../../generated/api/car.service';
import { CarMake } from '../../../../generated/model/carMake';
import { CarType } from '../../../../generated/model/carType';
import { MatDialog } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../../../shared/yes-no-dialog/yes-no-dialog.component';

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
  public carClassList: CarClass[];

  public isLoading: boolean;

  private _onDestroy = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private carService: CarService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }

  ngOnInit() {

    forkJoin([this.carService.readAllCarMakes(), this.carService.readAllCarTypes(), this.carService.readAllCarClasses()])
      .pipe(takeUntil(this._onDestroy))
      .subscribe(([carMakeList, carTypeList, carClassList]: [CarMake[], CarType[], CarClass[]]) => {
          this.carMakeList = carMakeList;
          this.carTypeList = carTypeList;
          this.carClassList = carClassList;
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
          carType: {} as CarType,
          carClass: {} as CarClass
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
            this.router.navigate(['/car']);
          });
      }
    });
  }

  private _initForm() {
    this.form = new FormGroup({
      idCar: new FormControl({value: this.car.idCar, disabled: true}),
      carMake: new FormControl(this.car.carMake.idCarMake, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      carType: new FormControl(this.car.carType.idCarType, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      carClass: new FormControl(this.car.carClass.idCarClass, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      carName: new FormControl(this.car.carName, Validators.compose([Validators.maxLength(this.strLimit), Validators.required])),
      carNr: new FormControl(this.car.carNr, Validators.compose([Validators.maxLength(this.strLimit), Validators.required]))
    });
  }

  public saveCar() {
    if (this.form.valid) {
      this.car.carMake.idCarMake = this.form.get('carMake').value;
      this.car.carType.idCarType = this.form.get('carType').value;
      this.car.carClass.idCarClass = this.form.get('carClass').value;
      this.car.carName = this.form.get('carName').value;
      this.car.carNr = this.form.get('carNr').value;

      if (this.car.idCar) {
        this.carService.updateCar(this.car)
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.snackBar.open('Auto speichern erfolgreich.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-success'});
          }, () => {
            this.snackBar.open('Auto speichern fehlgeschlagen.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-error'});
          });
      } else {
        this.carService.addCar(this.car)
          .pipe(takeUntil(this._onDestroy))
          .subscribe((idCar: number) => {
            this.snackBar.open('Auto speichern erfolgreich.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-success'});
            this.router.navigate(['car', idCar]);
          }, () => {
            this.snackBar.open('Auto speichern fehlgeschlagen.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-error'});
          });
      }
    }
  }

  public deleteCar() {
    const dialogRef = this.dialog.open(YesNoDialogComponent, {
      width: '400px',
      data: {title : 'Auto löschen', text: 'Wollen Sie das Auto wirklich löschen?'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.carService.deleteCarById(this.car.idCar)
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.snackBar.open('Auto löschen erfolgreich.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-success'});
            this.router.navigate(['/car']);
          }, () => {
            this.snackBar.open('Auto löschen fehlgeschlagen.', 'OK', {duration: 2000, panelClass: 'cr-snackbar-error'});
          });
      }
    });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

}
