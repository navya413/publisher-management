import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsPopupComponent } from './stats-popup.component';

describe('StatsPopupComponent', () => {
  let component: StatsPopupComponent;
  let fixture: ComponentFixture<StatsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
