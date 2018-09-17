import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxiMapComponent } from './taxi-map.component';

describe('TaxiMapComponent', () => {
  let component: TaxiMapComponent;
  let fixture: ComponentFixture<TaxiMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxiMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxiMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
