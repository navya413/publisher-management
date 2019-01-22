import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  DateRangePreset,
  DateRangeValue,
  YESTERDAY
} from '../date-range/presets.util';
import * as moment from 'moment';
@Component({
  selector: 'jv-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangeComponent),
      multi: true
    }
  ]
})
export class DateRangeComponent implements ControlValueAccessor, OnInit {
  // The format in which the date is to be consumed.
  // Primarily for the purposes of sending data to server.
  @Input()
  outputFormat;

  // What's the format of the provided input dates.
  @Input()
  inputFormat;
  // The format in which the selected dates should show up in
  // the triggering Input fields.
  @Input()
  displayFormat;

  // List of preset ranges that needs to be shown.
  @Input()
  presets;

  // Min date that a user can select
  @Input()
  min;

  // Max date that a user can select.
  @Input()
  max;

  // open direction
  @Input()
  direction = 'right';

  instanceId: number;

  ranges = {};

  @Input()
  defaultRange: DateRangePreset = YESTERDAY;

  // Initial value of the date range.
  @Input('value')
  _value;

  @Output()
  dateChange: EventEmitter<any> = new EventEmitter();

  locale = {};
  propagateChange = (_: any) => {};

  set value(val: any) {
    if (val) {
      this._value = val;
    }
  }
  get value() {
    return this._value;
  }
  constructor() {
    this.instanceId = new Date().getTime();
  }
  ngOnInit() {
    // Setup Ranges
    this.presets.forEach(preset => {
      this.ranges[preset.name] = preset.range;
    });

    // Setup Locale.
    this.locale = {
      format: this.displayFormat
    };
  }
  // ControlValueAccessor stuff!
  writeValue(value: any) {
    if (value) {
      this.value = value;
    }
  }
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched() {}
  onChange() {
    const outputValue: DateRangeValue = { startDate: '', endDate: '' };
    if (this.outputFormat) {
      outputValue.startDate = moment(this.value.startDate).format(
        this.outputFormat
      );
      outputValue.endDate = moment(this.value.endDate).format(
        this.outputFormat
      );
    } else {
      outputValue.startDate = this.value.startDate.toString();
      outputValue.endDate = this.value.endDate.toString();
    }
    this.propagateChange(outputValue);
    this.dateChange.emit(outputValue);
  }
}
