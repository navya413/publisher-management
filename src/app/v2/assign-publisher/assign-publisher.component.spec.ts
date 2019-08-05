import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPublisherComponent } from './assign-publisher.component';

describe('AssignPublisherComponent', () => {
  let component: AssignPublisherComponent;
  let fixture: ComponentFixture<AssignPublisherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignPublisherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
