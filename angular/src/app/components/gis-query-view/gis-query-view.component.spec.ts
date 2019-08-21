import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GisQueryViewComponent } from './gis-query-view.component';

describe('GisQueryViewComponent', () => {
  let component: GisQueryViewComponent;
  let fixture: ComponentFixture<GisQueryViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GisQueryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GisQueryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
