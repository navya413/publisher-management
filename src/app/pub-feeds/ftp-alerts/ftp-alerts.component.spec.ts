import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FtpAlertsComponent } from './ftp-alerts.component';

describe('FtpAlertsComponent', () => {
  let component: FtpAlertsComponent;
  let fixture: ComponentFixture<FtpAlertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtpAlertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtpAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
