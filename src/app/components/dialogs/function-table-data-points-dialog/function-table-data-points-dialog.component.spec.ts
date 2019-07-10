import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionTableDataPointsDialogComponent } from './function-table-data-points-dialog.component';

describe('FunctionTableDataPointsDialogComponent', () => {
  let component: FunctionTableDataPointsDialogComponent;
  let fixture: ComponentFixture<FunctionTableDataPointsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionTableDataPointsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionTableDataPointsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
