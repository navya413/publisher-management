import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityNavComponent } from './entity-nav.component';

describe('EntityNavComponent', () => {
  let component: EntityNavComponent;
  let fixture: ComponentFixture<EntityNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
