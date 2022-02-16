import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopForecastProcessComponent } from './stop-forecast-process.component';

describe('StopForecastProcessComponent', () => {
  let component: StopForecastProcessComponent;
  let fixture: ComponentFixture<StopForecastProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopForecastProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopForecastProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
