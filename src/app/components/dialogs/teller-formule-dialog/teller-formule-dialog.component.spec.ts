import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TellerFormuleDialogComponent } from './teller-formule-dialog.component';

describe('TellerFormuleDialogComponent', () => {
  let component: TellerFormuleDialogComponent;
  let fixture: ComponentFixture<TellerFormuleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TellerFormuleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TellerFormuleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
