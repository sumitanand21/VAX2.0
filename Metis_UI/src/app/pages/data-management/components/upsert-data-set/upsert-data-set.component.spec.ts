import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertDataSetComponent } from './upsert-data-set.component';

describe('UpsertDataSetComponent', () => {
  let component: UpsertDataSetComponent;
  let fixture: ComponentFixture<UpsertDataSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertDataSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertDataSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
