import * as moment from 'moment';
export interface DateRangePreset {
  name: string;
  range: Array<moment.Moment>;
}

export interface DateRangeValue {
  startDate: string;
  endDate: string;
}

export const TODAY: DateRangePreset = {
  name: 'Today',
  range: [moment(), moment()]
};
export const YESTERDAY: DateRangePreset = {
  name: 'Yesterday',
  range: [moment().subtract(1, 'days'), moment().subtract(1, 'days')]
};
export const THIS_WEEK: DateRangePreset = {
  name: 'This Week',
  range: [moment().startOf('week'), moment()]
};
export const THIS_MONTH: DateRangePreset = {
  name: 'This Month',
  range: [moment().startOf('month'), moment()]
};
export const LAST_WEEK: DateRangePreset = {
  name: 'Last Week',
  range: [
    moment()
      .subtract(1, 'week')
      .startOf('week'),
    moment()
      .subtract(1, 'week')
      .endOf('week')
  ]
};
export const LAST_MONTH: DateRangePreset = {
  name: 'Last Month',
  range: [
    moment()
      .subtract(1, 'month')
      .startOf('month'),
    moment()
      .subtract(1, 'month')
      .endOf('month')
  ]
};
export const LAST_30_DAYS: DateRangePreset = {
  name: 'Last 30 Days',
  range: [moment().subtract(30, 'days'), moment().subtract(1, 'days')]
};
