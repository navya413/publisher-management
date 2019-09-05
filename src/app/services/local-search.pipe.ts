import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';
import { UtilService } from "./util.service";


@Pipe({
  name: "localSearch"
})
export class LocalSearchPipe implements PipeTransform {
  transform(items: any[], searchText: string, searchKey: string): any[] {
    if (!searchText) {
      return items;
    }
    return this.getResults(items, searchText, searchKey);
  }

  getResults(items: any[], searchText: string, searchKey: string) {
    let results = [];

    searchText = searchText.toLowerCase();

    for (const item of items) {
      if (searchKey && typeof item[searchKey] === "boolean" && item[searchKey]) {
        results.push(item);
      }

      if (searchKey && typeof item[searchKey] == "string" && item[searchKey].toLowerCase().search(searchText) != -1) {
        results.push(item);
      }

      if (!searchKey && item.toLowerCase().search(searchText) !== -1) {
        results.push(item);
      }
    }

    return results;
  }
}

@Pipe({
  name: 'timerange',
  pure: true
})
export class TimerangeFormatterPipe implements PipeTransform {
  constructor() {}
  transform(val: any): any {
    const seconds = moment.duration(val).seconds();
    const minutes = moment.duration(val).minutes();
    const hours = Math.trunc(moment.duration(val).asHours());
    return `${hours.toString().length < 2 ? '0' : ''}${hours} : ${
      minutes.toString().length < 2 ? '0' : ''
    }${minutes} : ${seconds.toString().length < 2 ? '0' : ''}${seconds}`;
  }
}


@Pipe({
  name: 'numberFormatter',
  pure: true
})
export class NumberFormatterPipe implements PipeTransform {
  constructor(public utilService: UtilService) {}
  transform(value: string, type: string): string {
    if (type) {
      const number = Number.call(null, value);
      const string = number.toLocaleString(undefined, {
        minimumFractionDigits: number.toString().includes('.') ? 2 : 0,
        maximumFractionDigits: 2
      });

      switch (type) {
        case 'currency':
          return `${this.utilService.getCurrency()}${string}`;
        case 'percentage':
          return `${string}%`;
      }
    }
    return Number.call(null, value).toLocaleString();
  }
}
