import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BreadcrumbComponent } from '@mojo/home/components/breadcrumb/breadcrumb.component';
import { BreadcrumbSegment } from '@mojo/home/components/breadcrumb/breadcrumb.model';
describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [BreadcrumbComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render nothing if there are no segments', () => {
    const segmentsElement = fixture.nativeElement.querySelector('.segments');
    expect(segmentsElement).toBeNull();
  });
  it('should render breadcrumbs according to provided segments', () => {
    const nativeElement = fixture.nativeElement;
    const segments: BreadcrumbSegment[] = [
      {
        name: 'Client 1',
        label: 'Client',
        url: ['/', 'clients', '1']
      },
      {
        name: 'campaign 1.1',
        label: 'campaign'
      }
    ];
    component.segments = segments;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.segments')).not.toBeNull();
    expect(nativeElement.querySelectorAll('.segment').length).toBe(2);
  });

  it('should create a link if a url if a segment has url', () => {
    const nativeElement = fixture.nativeElement;
    const segments: BreadcrumbSegment[] = [
      {
        name: 'Client 1',
        label: 'Client',
        url: ['/', 'clients', '1']
      }
    ];
    component.segments = segments;
    fixture.detectChanges();
    expect(
      nativeElement.querySelector('.segment__name') instanceof HTMLAnchorElement
    ).toBe(true);
  });

  it(`should create a simple text if there is no url or the url array is empty`, () => {
    const nativeElement = fixture.nativeElement;
    let segments: BreadcrumbSegment[] = [
      {
        name: 'Client 1',
        label: 'Client'
      }
    ];
    component.segments = segments;
    fixture.detectChanges();
    expect(
      nativeElement.querySelector('.segment__name') instanceof HTMLSpanElement
    ).toBe(true);

    segments = [
      {
        name: 'Client 1',
        label: 'Client',
        url: []
      }
    ];
    component.segments = segments;
    fixture.detectChanges();
    expect(
      nativeElement.querySelector('.segment__name') instanceof HTMLSpanElement
    ).toBe(true);
  });

  it('should have a separator(:) if only there is both label and name', () => {
    const nativeElement = fixture.nativeElement;
    let segments: BreadcrumbSegment[] = [
      {
        name: 'Client 1',
        url: []
      }
    ];
    component.segments = segments;
    fixture.detectChanges();
    expect(nativeElement.querySelector('.segment__label-separator')).toBeNull();

    segments = [
      {
        label: 'Client',
        name: 'Client 1'
      }
    ];
    component.segments = segments;
    fixture.detectChanges();
    expect(
      nativeElement.querySelector('.segment__label-separator')
    ).not.toBeNull();
  });
});
