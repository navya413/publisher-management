import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubFeedsComponent } from './pub-feeds.component';

describe('PubFeedsComponent', () => {
  let component: PubFeedsComponent;
  let fixture: ComponentFixture<PubFeedsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubFeedsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubFeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
