import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import * as moment from 'moment';
import { MatMenuTrigger } from '@angular/material';

@Component({
  selector: 'jv-timerange',
  templateUrl: './timerange-picker.component.html',
  styleUrls: ['./timerange-picker.component.scss']
})
export class TimerangePickerComponent implements OnChanges {
  @Input() timeRange = 0;

  @ViewChild('menuTrigger') menuTrigger;

  hours = 0;
  minutes = 0;
  seconds = 0;

  @Output() apply: EventEmitter<any> = new EventEmitter<any>();
  constructor() {}

  ngOnChanges() {
    const duration = moment.duration(this.timeRange, 'milliseconds');

    this.seconds = moment.duration(duration).seconds();
    this.minutes = moment.duration(duration).minutes();
    this.hours = Math.trunc(moment.duration(duration).asHours());
  }

  increase(entity) {
    switch (entity) {
      case 'hours':
        this.hours++;
        break;
      case 'minutes':
        this.minutes < 59 && this.minutes++;
        break;
      case 'seconds':
        this.seconds < 59 && this.seconds++;
        break;
    }
  }

  decrease(entity) {
    switch (entity) {
      case 'hours':
        this.hours > 0 && this.hours--;
        break;
      case 'minutes':
        this.minutes > 0 && this.minutes--;
        break;
      case 'seconds':
        this.seconds > 0 && this.seconds--;
        break;
    }
  }

  onApply() {
    this.apply.emit(
      (this.hours * 3600 + this.minutes * 60 + this.seconds) * 1000
    );
    this.menuTrigger.closeMenu();
  }
}
