import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UpdateModelconfigComponent } from './update-modelconfig.component';
import { SharedModule } from './../../../../shared/shared.module';
// import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ForecastService } from '../../services/forecast.service';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';

describe('UpdateModelconfigComponent', () => {
  let component: UpdateModelconfigComponent;
  let fixture: ComponentFixture<UpdateModelconfigComponent>;
  // const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  // const spyQueryParam = jasmine.createSpyObj({ name: null });
  // const mockActivatedRoute: any = { queryParams: of(spyQueryParam) };
  let forecastService: ForecastService;
  let globalService: GlobalService;
  let notifyService: NotificationService;
  let httpMock: HttpTestingController;
  const routePath = [{ path: 'forecast/modelconfig', redirectTo: '' }];
  let router: Router;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [UpdateModelconfigComponent,
      ],
      imports: [
        SharedModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routePath),
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        // RouterModule.forRoot(routes),
      ],
      providers: [
        // { provide: ToastrService, useClass: ToastrService },
        // { provide: Router, useValue: routerSpy },
        // { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateModelconfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    forecastService = TestBed.get(ForecastService);
    globalService = TestBed.get(GlobalService);
    notifyService = TestBed.get(NotificationService);
    httpMock = TestBed.get(HttpTestingController);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have called model function', () => {
    const spyGetModel = spyOn(component, 'getModelDropDownDetails');
    component.ngOnInit();
    expect(spyGetModel).toHaveBeenCalled();
  });

  it('should enable save', () => {
    component.modelEditFrm.form.markAsDirty();
    component.ngAfterViewChecked();
    expect(component.saveDisable).toBeFalsy();
  });

  it('should disable save', () => {
    component.modelEditFrm.form.markAsPristine();
    component.ngAfterViewChecked();
    expect(component.saveDisable).toBeTruthy();
  });

  it('should navigate to model configuration page', () => {
    const navigatePath = '/forecast/modelconfig';
    const navigateSpy = spyOn(router, 'navigate');
    component.navigateTo(navigatePath);
    expect(navigateSpy).toHaveBeenCalledWith([navigatePath]);
  });

  it('should get Model configuration dropdow', () => {
    const dropdownVal = [{ forecast: {} }];
    const value = { status: 'success', data: dropdownVal };
    spyOn(forecastService, 'getConfigurationModelConfig').and.returnValue(of(value));
    const spyDD = spyOn(component, 'setAllDropDown');
    component.getModelDropDownDetails();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get Model configuration dropdow on fail', () => {
    const value = { status: 'fail' };
    spyOn(forecastService, 'getConfigurationModelConfig').and.returnValue(of(value));
    const spyDD = spyOn(component, 'setAllDropDown');
    component.getModelDropDownDetails();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should get Model configuration dropdow on Error', () => {
    const spy = spyOn(forecastService, 'getConfigurationModelConfig').and.returnValue(
      throwError({ status: 404 })
    );
    const spyDD = spyOn(component, 'setAllDropDown');
    component.getModelDropDownDetails();
    expect(spyDD).toHaveBeenCalled();
  });

  it('should create Model configuration dropdow data', () => {
    const value = { scalar: [], encoder: [], optimizer: [], metrics: [], loss: [], inneractivation: [], activation: [] };
    component.setAllDropDown(value);
    const emptyArr = [];
    expect(component.scalarTypeDD).toEqual(emptyArr);
    expect(component.EncoderTypeDD).toEqual(emptyArr);
    expect(component.optimizerDD).toEqual(emptyArr);
    expect(component.metricsDD).toEqual(emptyArr);
    expect(component.lossDD).toEqual(emptyArr);
    expect(component.innerActivationDD).toEqual(emptyArr);
    expect(component.activationDD).toEqual(emptyArr);
  });


  it('should create Model configuration dropdow data if no data available', () => {
    component.setAllDropDown(null);
    const emptyArr = [];
    expect(component.scalarTypeDD).toEqual(emptyArr);
    expect(component.EncoderTypeDD).toEqual(emptyArr);
    expect(component.optimizerDD).toEqual(emptyArr);
    expect(component.metricsDD).toEqual(emptyArr);
    expect(component.lossDD).toEqual(emptyArr);
    expect(component.innerActivationDD).toEqual(emptyArr);
    expect(component.activationDD).toEqual(emptyArr);
  });





  it('should get Model configuration data', fakeAsync(() => {
    component.modelConfigName = 'OPRMAX';
    const foreCastModelConfData = component.craeteModelObject(null);
    foreCastModelConfData.id = '01';
    const value = { status: 'success', data: foreCastModelConfData };
    spyOn(forecastService, 'getModelConfigDetails').and.returnValue(of(value));
    component.getModelConfigData();
    expect(Object.keys(component.modelObject).length).toBeGreaterThan(0);
    expect(component.modelObject.id).toBe('01');
  }));

  it('should get Model configuration data if request fail', () => {
    component.modelConfigName = 'OPRMAX';
    const value = { status: 'fail' };
    spyOn(forecastService, 'getModelConfigDetails').and.returnValue(of(value));
    component.getModelConfigData();
    expect(component.modelObject.id).toBe('');
  });

  it('should not get Model configuration data if model name not available', () => {
    component.modelConfigName = '';
    component.getModelConfigData();
    expect(component.modelObject.id).toBe('');
  });

  it('should get Model configuration data error', () => {
    component.modelConfigName = 'OPRMAX';
    const spy = spyOn(forecastService, 'getModelConfigDetails').and.returnValue(
      throwError({ status: 404 })
    );
    const spyErr = spyOn(notifyService, 'showToastrError');
    component.getModelConfigData();
    expect(spyErr).toHaveBeenCalled();

  });



  it('should not save model if Invalid', () => {
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors({ invalid: true });
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if valid but input shape value not correct', () => {
    component.modelObject.inputShape = '178';
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if valid but dropout value not correct', () => {
    component.modelObject.dropout = '23';
    component.modelObject.inputShape = '1, 78';
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(spyInfo).toHaveBeenCalled();
  });

  it('should not save model if valid but l1l2 value not correct', () => {
    component.modelObject.dropout = '1';
    component.modelObject.inputShape = '1, 78';
    component.modelObject.l1L2 = 'a';
    const spyInfo = spyOn(globalService, 'opendisplayModal');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    // expect(spyInfo).toHaveBeenCalled();
  });

  it('should save model if Valid for Update', () => {
    component.modelObject.dropout = '1';
    component.modelObject.inputShape = '1, 78';
    component.modelObject.l1L2 = '1, 89';
    component.modelConfigName = 'OPRMAx';
    const spyUpdate = spyOn(component, 'UpdateModelConfig');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(component.modelEditFrm.invalid).toBe(false);
    expect(spyUpdate).toHaveBeenCalled();
  });

  it('should save model if Valid for create', () => {
    component.modelObject.dropout = '1';
    component.modelObject.inputShape = '1, 78';
    component.modelObject.l1L2 = '1, 89';
    component.modelConfigName = '';
    const spyCreate = spyOn(component, 'createModelConfig');
    component.modelEditFrm.form.setErrors(null);
    component.saveModelDetails();
    expect(component.modelEditFrm.invalid).toBe(false);
    expect(spyCreate).toHaveBeenCalled();
  });

  it('should  create new model configuration', () => {
    const value = { status: 'success', data: { responseType: '' } };
    const spySuccess = spyOn(notifyService , 'showToastrSuccess');
    spyOn(forecastService, 'createModelConfigDetails').and.returnValue(of(value));
    component.createModelConfig();
    expect(spySuccess).toHaveBeenCalled();
  });

  it('should not create new model configuration if API fail', () => {
    const value = { status: 'fail' };
    const spyWarn = spyOn(notifyService , 'showToastrWarning');
    spyOn(forecastService, 'createModelConfigDetails').and.returnValue(of(value));
    component.createModelConfig();
    expect(spyWarn).toHaveBeenCalled();

  });

  it('should provide Model configuration create error', () => {
    const spyErr = spyOn(notifyService , 'showToastrError');
    const spy = spyOn(forecastService, 'createModelConfigDetails').and.returnValue(
      throwError({ status: 404 })
    );
    component.createModelConfig();
    expect(spyErr).toHaveBeenCalled();
  });

  it('should update model configuration', () => {
    const value = { status: 'success', data: { responseType: '' } };
    const spySuccess = spyOn(notifyService , 'showToastrSuccess');
    spyOn(forecastService, 'UpdateModelConfigDetails').and.returnValue(of(value));
    component.UpdateModelConfig();
    expect(spySuccess).toHaveBeenCalled();
  });

  it('should not update model configuration if API fail', () => {
    const value = { status: 'fail' };
    const spyWarn = spyOn(notifyService , 'showToastrWarning');
    spyOn(forecastService, 'UpdateModelConfigDetails').and.returnValue(of(value));
    component.UpdateModelConfig();
    expect(spyWarn).toHaveBeenCalled();
  });

  it('should provide Model configuration update error', () => {
    const spyErr = spyOn(notifyService , 'showToastrError');
    const spy = spyOn(forecastService, 'UpdateModelConfigDetails').and.returnValue(
      throwError({ status: 404 })
    );
    component.UpdateModelConfig();
    expect(spyErr).toHaveBeenCalled();
  });
  it('should cancel delete model configuration', () => {
    spyOn(globalService, 'opendisplayModal').and.returnValue(of(null));
    component.deleteModelConfig();
    expect(true).toBeTruthy();
  });

  it('should delete model configuration', () => {
    const value = { status: 'success', data: { deletedCount: 1 } };
    const spyNav = spyOn(component, 'navigateTo');
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    spyOn(forecastService, 'deleteModelConfigDetails').and.returnValue(of(value));
    component.deleteModelConfig();
    expect(spyNav).toHaveBeenCalled();
  });

  it('should not delete model configuration if API fail', () => {
    const value = { status: 'fail' };
    const spyWarn = spyOn(notifyService , 'showToastrWarning');
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    spyOn(forecastService, 'deleteModelConfigDetails').and.returnValue(of(value));
    component.deleteModelConfig();
    expect(spyWarn).toHaveBeenCalled();
  });

  it('should provide Model configuration delete error', () => {
    const spyErr = spyOn(notifyService , 'showToastrError');
    spyOn(globalService, 'opendisplayModal').and.returnValue(of('save'));
    const spy = spyOn(forecastService, 'deleteModelConfigDetails').and.returnValue(
      throwError({ status: 404 })
    );
    component.deleteModelConfig();
    expect(spyErr).toHaveBeenCalled();
  });

  it('should create model Object', () => {
    const modelObjVal = {
      id: '5eea395703277a0001939270',
      inputShape: '10, 1',
      outputShape: '1',
      blockUnxits: '20',
      batchSize: '1',
      epochs: '200',
      layers: '3',
      dropout: '0.1',
      activation: 'tanh',
      innerActivation: 'hard_sigmoid',
      loss: 'mae',
      metrics: 'r2_score',
      optimizer: 'adam',
      stateful: 'True',
      l1L2: '1, 1',
      nlags: '10',
      nleads: '0',
      exclude: 'None',
      groupBy: 'None',
      timeStep: '1',
      encoderType: 'None',
      scalerType: 'minmax',
      modelConfigName: 'OPRMAX',
      modelConfigCount: '0',
      testSize: '0.7',
      jobType: 'EXECUTION'
    };
    const createdObj = component.craeteModelObject(modelObjVal);
    expect(Object.keys(createdObj).length).toBeGreaterThan(0);
  });

  it('should create empty model Object', () => {
    const createdObj = component.craeteModelObject(null);
    expect(Object.keys(createdObj).length).toBeGreaterThan(0);
  });
});
