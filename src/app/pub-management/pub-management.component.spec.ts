import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PubManagementComponent } from './pub-management.component';

describe('PubManagementComponent', () => {
  let component: PubManagementComponent;
  let fixture: ComponentFixture<PubManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PubManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PubManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
