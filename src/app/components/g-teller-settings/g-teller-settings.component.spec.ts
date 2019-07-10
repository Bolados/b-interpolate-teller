import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GTellerSettingsComponent } from './g-teller-settings.component';

describe('GTellerSettingsComponent', () => {
  let component: GTellerSettingsComponent;
  let fixture: ComponentFixture<GTellerSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GTellerSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GTellerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
