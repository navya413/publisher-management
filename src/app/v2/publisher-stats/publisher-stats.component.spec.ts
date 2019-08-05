import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherStatsComponent } from './publisher-stats.component';

describe('PublisherStatsComponent', () => {
  let component: PublisherStatsComponent;
  let fixture: ComponentFixture<PublisherStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublisherStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisherStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
