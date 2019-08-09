import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencySetupComponent } from './agency-setup.component';

describe('AgencySetupComponent', () => {
  let component: AgencySetupComponent;
  let fixture: ComponentFixture<AgencySetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencySetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencySetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
