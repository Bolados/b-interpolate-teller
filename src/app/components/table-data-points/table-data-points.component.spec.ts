import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDataPointsComponent } from './table-data-points.component';

describe('TableDataPointsComponent', () => {
  let component: TableDataPointsComponent;
  let fixture: ComponentFixture<TableDataPointsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDataPointsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDataPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
