import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import * as moment from 'moment';

interface Range {
  title: string;
  value: {
    days: string,
    startDate: string,
    endDate: string
  };
}

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit, OnChanges {
  @Output() onDateRangeChange: EventEmitter<any> = new EventEmitter();

  @Input() rangeFormat = 'MM/DD/YYYY';
  @Input() selectedDay;
  @Input() startDate;
  @Input() endDate;

  selectedRange;

  ranges: Range[];
  constructor() {
  }

  ngOnInit() {
    // this.onDateRangeChange.emit(this.selectedRange);
  }

  ngOnChanges() {
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

    this.ranges[this.ranges.length - 1].value['startDate'] = this.startDate ? this.startDate : moment().format(this.rangeFormat);
    this.ranges[this.ranges.length - 1].value['endDate'] = this.endDate ? this.endDate : moment().format(this.rangeFormat);
    this.selectedRange = this.ranges.filter((range) => {
      return range.value.days === this.selectedDay;
    })[0];
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
