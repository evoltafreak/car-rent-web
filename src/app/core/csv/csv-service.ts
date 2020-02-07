import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';

@Injectable({providedIn: 'root'})
export class CsvService {

  private datePipe: DatePipe = new DatePipe('de-CH');

  constructor() {
  }


  public showCsv(csv: string, fileName: string): void {
    const fileData = [csv];
    const blobObject = new Blob(['\uFEFF' + fileData], {
      type: 'text/csv; charset=utf-8'
    });

    if (isNullOrUndefined(fileName)) {
      fileName = 'data.csv';
    }

    if (!fileName.endsWith('.csv')) {
      fileName = fileName + '.csv';
    }

    try {
      window.navigator.msSaveOrOpenBlob(blobObject, fileName);
    } catch (err) {
      const data = window.URL.createObjectURL(blobObject);
      const link = document.createElement('a');
      link.href = data;
      link.download = fileName;
      link.click();
    }
  }

  public exportCsvFile(headers: Array<string>, properties: Array<string>, dataList: Array<any>, dataTypeList: Array<string>, fileName?: string): void {
    const colSeperator = ';';
    const rowSeperator = '\n';
    this.showCsv(this._exportAsCsv(headers, properties, dataList, dataTypeList, colSeperator, rowSeperator), fileName);
  }

  private _exportAsCsv(headers: Array<string>, properties: Array<string>, dataList: Array<any>, dataTypeList: Array<string>, colSeperator: string, rowSeperator: string): string {
    let header = '';
    let csv = '';

    for (const col of headers) {
      header += col;
      header += colSeperator;
    }

    header += rowSeperator;
    csv += header;
    if (!isNullOrUndefined(dataList)) {
      for (const data of dataList) {
        let row = '';
        let i = 0;
        for (const col of properties) {
          if (data[col] || data[col] === 0 || dataTypeList[i] === 'boolean') {
            row += this._formatValue(data[col], dataTypeList[i], colSeperator);
          }
          row += colSeperator;
          i++;
        }
        row += rowSeperator;
        csv += row;
      }
    }

    return csv;
  }

  private _formatValue(value: string, dataType: string, colSeperator: string) {

    if (dataType === 'date') {
      value = this.datePipe.transform(value, 'dd.MM.yyyy');
    }

    if (dataType === 'datetime') {
      value = this.datePipe.transform(value, 'dd.MM.yyyy HH:mm:ss');
    }

    if (dataType === 'boolean') {
      value = value ? 'Ja' : 'Nein';
    }

    // Replace column separator with blank to avoid creating invalid csv files
    value = value.toString().replace(new RegExp(colSeperator, 'g'), ' ');
    return value;
  }

}
