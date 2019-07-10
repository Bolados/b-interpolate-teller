import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsSettingsComponent } from './points-settings.component';

describe('PointsSettingsComponent', () => {
  let component: PointsSettingsComponent;
  let fixture: ComponentFixture<PointsSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointsSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
