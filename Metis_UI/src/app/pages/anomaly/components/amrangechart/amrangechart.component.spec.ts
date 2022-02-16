import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmrangechartComponent } from './amrangechart.component';

describe('AmrangechartComponent', () => {
  let component: AmrangechartComponent;
  let fixture: ComponentFixture<AmrangechartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmrangechartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmrangechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
