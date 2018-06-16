import { Injectable } from '@angular/core';

import { FileInfo } from './file.model';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  constructor() {}

  readExcelFile<T>(evt: any, fileInfo: FileInfo, callback: (data: Array<T>, error: Error) => void) {
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length === 0) {
      return;
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      let error: Error;
      let data: Array<T>;
      try {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        data = XLSX.utils.sheet_to_json(ws, {
          header: fileInfo.propertys
        });
        const header = data[0];
        for (let i = 0; i < fileInfo.header.length; ++i) {
          if (fileInfo.header[i] !== header[fileInfo.propertys[i]]) {
            throw Error(`表格表头不是“${fileInfo.header.join('、')}”。`);
          }
        }
        data.shift();
        const dataset = new Set(data.map(x => x[fileInfo.key])).size;
        if (data.length !== dataset) {
          throw Error('表格中有重复的行。');
        }
      } catch (er) {
        error = er;
        if (!error.message.startsWith('表格')) {
          error = Error('读取文件失败。');
        }
      } finally {
        callback(data, error);
      }
    };
    reader.readAsBinaryString(target.files[0]);
  }
}
