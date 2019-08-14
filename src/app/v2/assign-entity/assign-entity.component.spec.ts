import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEntityComponent } from './assign-entity.component';

describe('AssignPublisherComponent', () => {
  let component: AssignEntityComponent;
  let fixture: ComponentFixture<AssignEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
