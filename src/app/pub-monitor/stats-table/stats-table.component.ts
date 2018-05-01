import {Component, DoCheck, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-stats-table',
  templateUrl: './stats-table.component.html',
  styleUrls: ['./stats-table.component.scss'],
})
export class StatsTableComponent implements OnInit {
  @Input() value;
  @Input() title;
  @Input() loading;

  @Input() disableLink;
  @Input() disableClick;

  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() reload: EventEmitter<any> = new EventEmitter<any>();
  constructor(public utilService: UtilService) {}

  ngOnInit() {}

  onRowClick = function(row) {
    if (!this.disableClick) {
      this.rowClick.emit(row);
    }
  };

  onReload = function () {
    this.reload.emit();
  };
}
