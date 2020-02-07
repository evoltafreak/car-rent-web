import { ModuleWithProviders, NgModule } from '@angular/core';
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
import {
  MatChipsModule,
  MatDividerModule,
  MatFormFieldModule,
  MatProgressBarModule,
  MatProgressSpinnerModule, MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { PaginatorLabelService } from '../core/paginator/paginator-label.service';
import { TableOfContentsComponent } from './toc/table-of-contents.component';
import { LoadingBarComponent } from './loading-bar/loading-bar.component';

@NgModule({
  providers: [
    {provide: MatPaginatorIntl, useClass: PaginatorLabelService}
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
    MatSelectModule
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
    TableOfContentsComponent,
    LoadingBarComponent,
    MatSelectModule
  ],
  declarations: [TableOfContentsComponent, LoadingBarComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule
    };
  }
}
