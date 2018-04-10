import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsStatsComponent } from './clients-stats.component';

describe('ClientsStatsComponent', () => {
  let component: ClientsStatsComponent;
  let fixture: ComponentFixture<ClientsStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientsStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
