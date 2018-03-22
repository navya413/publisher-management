import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-editor-action',
  templateUrl: './editor-action.component.html',
  styleUrls: ['./editor-action.component.scss']
})
export class EditorActionComponent {

  @Input() loading: boolean;
  @Input() primaryBtn = 'OK';
  @Input() primaryIcon;
  @Input() primaryDisabled;
  @Input() secondaryBtn = 'Cancel';
  @Input() secondaryIcon;

  @Output() onPrimaryBtnClick: EventEmitter<any> = new EventEmitter();
  @Output() onSecondaryBtnClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

}
