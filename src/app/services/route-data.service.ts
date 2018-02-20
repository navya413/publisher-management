import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class RouteDataService {

  context = {
    data: {
      level: 'root'
    },
    params: null,
    url: null
  };
  contextSubject;
  constructor() {
    this.contextSubject = new BehaviorSubject(this.context);
  }

  setContext(context) {
    this.context = context;
    this.contextSubject.next(this.context);
  }

  resetContext() {
    this.context = {
      data: {
        level: 'root'
      },
      params: null,
      url: null
    }
    this.contextSubject.next(this.context);
  }
}
