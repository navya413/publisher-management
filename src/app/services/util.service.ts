import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class UtilService {
  agencies: string[] = [];
  countries: string[];
  industries: string[];
  categories: string[];
  currencies: string[];
  currenciesWithSymbol: any[];
  modesOfFile: string[];

  private ftpPublishers$: BehaviorSubject<string[]> = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
    http
      .get<string[]>(environment.feedsApi + 'placement/values')
      .subscribe((res: string[]) => {
        this.ftpPublishers$.next(res);
      });

    this.loadAgencies();
    this.loadEnums();
  }

  loadAgencies() {
    this.http
      .get<string[]>(environment.adminApi + 'agencies')
      .subscribe((res: string[]) => {
        this.agencies = res;
      });
  }

  loadEnums() {
    this.getEnums('country').subscribe(res => {
      this.countries = res;
    });
    this.getEnums('industry').subscribe(res => {
      this.industries = res;
    });
    this.getEnums('category').subscribe(res => {
      this.categories = res;
    });
    this.getEnums('currency').subscribe(res => {
      this.currencies = res;
    });
  
    this.getEnums('currencySymbol').subscribe(res => {
      this.currenciesWithSymbol = []
      res.forEach((curr:string)=>{
        this.currenciesWithSymbol.push({name:curr.split("__")[0],unicode:curr.split("__")[1]})
      })
    });

    this.getEnums('modeOfFile').subscribe(res => {
      this.modesOfFile = res;
    });
  }

  getEnums(type) {
    return this.http.get<any>(environment.adminApi + 'publishers/enums', {
      params: {
        type: type,
      },
    });
  }

  getFormattedNumber (number, isPercent = false) {
    let tempNumber;
    
    if(isNaN(number)){
        return number;
    }
    if (!isPercent) {
      tempNumber = Number.parseFloat(number.toFixed(2)).toLocaleString();
    } else {
      tempNumber = (number * 100).toFixed(2);
    }
    return tempNumber;
  }

  getFtpPublishersList() {
    return this.ftpPublishers$;
  }

  isEmpty(obj) {
    return !Object.keys(obj).length;
  }

  objectCleaner(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && typeof obj[key] === 'object') {
        this.objectCleaner(obj[key]);
        if (this.isEmpty(obj[key])) {
          delete obj[key];
        }
      }
      if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
        delete obj[key];
      }
    });
  }

  logSlack(request) {
    let msg = null;
    if (request.method === 'PUT') {
      msg = {
        attachments: [
          {
            color: '#F48024',
            title: 'Publisher Updated ' + request.body.id,
            footer: 'Pubmato API',
            text: JSON.stringify(request.body),
            footer_icon:
              'https://platform.slack-edge.com/img/default_application_icon.png',
          },
        ],
      };

    } else if (request.method === 'POST') {
      msg = {
        attachments: [
          {
            color: '#3f51b5',
            title: 'New Publisher Added',
            footer: 'Pubmato API',
            text: JSON.stringify(request.body),
            footer_icon:
              'https://platform.slack-edge.com/img/default_application_icon.png',
          },
        ],
      };
    }
    if (msg) {
      this.http
        .post<any>(
          'https://hooks.slack.com/services/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',
          msg,
          {
            headers: { 'content-type': 'text/plain' },
          },
        ).subscribe(res => {
        console.log(res);
      });
    }
  }
  downloadCSV(headers, model, fileName) {
    const data = [];
    data.push(headers);

    model.map(record => {
      const row = [];
      let parsedData = '';
      for (const key in headers) {
        if (headers[key] === 'IpAdress') {
          row.push(record.IpAdress);
        }
      }
      data.push(row);
    });

    let csvContent = 'data:text/csv;charset=utf-8,';
    data.map((infoArray, index) => {
      const dataString = infoArray.join(',');
      csvContent += index < data.length ? dataString + '\n' : dataString;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  }
}
