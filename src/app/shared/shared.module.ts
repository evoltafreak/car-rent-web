import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { PaginatorLabelService } from '../core/paginator/paginator-label.service';
import { TableOfContentsComponent } from './toc/table-of-contents.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CrDateAdapter } from '../core/cr-date-adapter';
import { MatDialogModule } from '@angular/material/dialog';
import { YesNoDialogComponent } from './yes-no-dialog/yes-no-dialog.component';

@NgModule({
  providers: [
    {provide: MatPaginatorIntl, useClass: PaginatorLabelService},
    {provide: DateAdapter, useClass: CrDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: {
        parse: {
          dateInput: ['l', 'LL'],
        },
        display: {
          dateInput: 'L',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      }},
    {provide: LOCALE_ID, useValue: 'de-CH'},
    {provide: MAT_DATE_LOCALE, useValue: 'de-CH'}
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatChipsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FlexLayoutModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatChipsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatCheckboxModule,
    TableOfContentsComponent,
    LoadingBarComponent,
    MatSelectModule,
    MatDialogModule
  ],
  declarations: [TableOfContentsComponent, LoadingBarComponent, YesNoDialogComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule
    };
  }
}
