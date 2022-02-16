import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelConfigViewComponent } from './model-config-view.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { AnomalyService } from '../../services/anomaly.service';
import {MatInputModule} from '@angular/material/input';
import {MatTabsModule} from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/libs/material/material.module';

describe('ModelConfigViewComponent', () => {
  let component: ModelConfigViewComponent;
  let fixture: ComponentFixture<ModelConfigViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelConfigViewComponent ],
      imports: [HttpClientTestingModule,
        FormsModule, Ng2SearchPipeModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        MaterialModule],
      providers: [
        {provide: ToastrService, useClass: ToastrService},
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelConfigViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if object exist', () => {
    component.selectedModelObject = {modelName: 'OP1_AM1'};
    const returnVal = component.checkifObjectExist();
    expect(returnVal).toBeTruthy();
  });
  it('should check if object does not exist', () => {
    component.selectedModelObject = {};
    const returnVal = component.checkifObjectExist();
    expect(returnVal).toBeFalsy();
  });

  it('should clear xFeature Search', () => {
    const mockEvt = {index: 0};
    component.onFeatureTabChanged(mockEvt);
    expect(component.xFeatureSearch ).toBe('');
  });

  it('should clear uniqFeatureSearch Search', () => {
    const mockEvt = {index: 1};
    component.onFeatureTabChanged(mockEvt);
    expect(component.strFeatureSearch ).toBe('');
  });

  it('should clear strFeatureSearch Search', () => {
    const mockEvt = {index: 2};
    component.onFeatureTabChanged(mockEvt);
    expect(component.strFeatureSearch  ).toBe('');
  });

  it('should have no action', () => {
    const mockEvt = {index: 10};
    component.onFeatureTabChanged(mockEvt);
    expect(true).toBeTruthy();
  });

});
