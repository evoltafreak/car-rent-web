import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class PaginatorLabelService extends MatPaginatorIntl {

  public itemsPerPageLabel = 'Werte pro Seite';
  public nextPageLabel = 'Nächste Seite';
  public previousPageLabel = 'Vorherige Seite';
  public firstPageLabel = 'Erste Seite';
  public lastPageLabel = 'Letzte Seite';

  constructor() {
    super();
  }

  public getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) { return `0 von ${length}`; }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} von ${length}`;
  }

}
