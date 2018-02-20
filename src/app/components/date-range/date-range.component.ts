import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

interface Range {
  title: string;
  value: Object;
}

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit {
  @Output() onDateRangeChange: EventEmitter<any> = new EventEmitter();

  @Input() rangeFormat = 'MM/DD/YYYY';

  startDate;
  endDate;
  selectedRange;

  ranges: Range[];
  constructor() {
    this.ranges = [
      {
        title: 'Today',
        value: {
          days: 'Today',
          startDate: moment().format(this.rangeFormat),
          endDate: moment().format(this.rangeFormat)
        }
      },
      {
        title: 'Yesterday',
        value: {
          days: 'Yesterday',
          startDate: moment()
            .subtract(1, 'days')
            .format(this.rangeFormat),
          endDate: moment()
            .subtract(1, 'days')
            .format(this.rangeFormat)
        }
      },
      {
        title: 'Last 7 Days',
        value: {
          days: '7',
          startDate: moment()
            .subtract(6, 'days')
            .format(this.rangeFormat),
          endDate: moment().format(this.rangeFormat)
        }
      },
      {
        title: 'Last 30 Days',
        value: {
          days: '30',
          startDate: moment()
            .subtract(29, 'days')
            .format(this.rangeFormat),
          endDate: moment().format(this.rangeFormat)
        }
      },
      {
        title: 'This Month',
        value: {
          days: 'This month',
          startDate: moment()
            .startOf('month')
            .format(this.rangeFormat),
          endDate: moment()
            .endOf('month')
            .format(this.rangeFormat)
        }
      },
      {
        title: 'Last Month',
        value: {
          days: 'Last month',
          startDate: moment()
            .subtract(1, 'month')
            .startOf('month')
            .format(this.rangeFormat),
          endDate: moment()
            .subtract(1, 'month')
            .endOf('month')
            .format(this.rangeFormat)
        }
      },
      {
        title: 'Custom',
        value: {
          days: 'CUSTOM',
          startDate: moment().format(this.rangeFormat),
          endDate: moment().format(this.rangeFormat)
        }
      }
    ];
  }

  ngOnInit() {
    this.selectedRange = this.ranges[4];
    // this.onDateRangeChange.emit(this.selectedRange);
  }

  onRangeChange(range) {
    this.selectedRange = range;
    this.onDateRangeChange.emit(range);
  }

  customDateChange(date, type) {
    this.selectedRange.value[type] = moment(new Date(date.value)).format(
      this.rangeFormat
    );
    this.onDateRangeChange.emit(this.selectedRange);
  }

  get customStartDate() {
    return moment(new Date(this.selectedRange.value.startDate)).format();
  }
  get customEndDate() {
    return moment(new Date(this.selectedRange.value.endDate)).format();
  }
}
