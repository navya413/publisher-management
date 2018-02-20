import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubMonitorComponent } from './pub-monitor.component';

describe('PubMonitorComponent', () => {
  let component: PubMonitorComponent;
  let fixture: ComponentFixture<PubMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
