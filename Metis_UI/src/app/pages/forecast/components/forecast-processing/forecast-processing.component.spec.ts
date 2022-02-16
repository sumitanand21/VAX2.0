import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ForecastProcessingComponent, EditForecastprocessingComponent } from './forecast-processing.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { DatePipe } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
// import { ModalModule } from 'ngx-bootstrap';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component, NgModule } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { StopForecastProcessComponent } from '../../dialogs/stop-forecast-process/stop-forecast-process.component';
import { MaterialModule } from 'src/app/libs/material/material.module';
import { RouterModule, Router } from '@angular/router';


// Noop component is only a workaround to trigger change detection
@Component({
  template: ''
})
class NoopComponent { }

const TEST_DIRECTIVES = [
  EditForecastprocessingComponent,
  StopForecastProcessComponent,
  NoopComponent
];
// MatDialog ends Here
@NgModule({
  imports: [MatDialogModule, NoopAnimationsModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    EditForecastprocessingComponent,
    StopForecastProcessComponent
  ],
})
class DialogTestModule { }



describe('ForecastProcessingComponent', () => {
  let component: ForecastProcessingComponent;
  let fixture: ComponentFixture<ForecastProcessingComponent>;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForecastProcessingComponent],
      imports: [HttpClientTestingModule,
        MaterialModule,
        FormsModule,
        NgxPaginationModule, FilterPipeModule,
        Ng2SearchPipeModule, OrderModule, ModalModule.forRoot(),
        ToastrModule.forRoot(), BrowserAnimationsModule,
        RouterModule],
      providers: [DatePipe, BsModalService,
        { provide: ToastrService, useClass: ToastrService },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('on selection of process', () => {
    component.onSelectProcess('forecast');
    const val: any = 'forecast';
    const data = Object.assign({
      ...val,
      Url:
        component.sanitizer
          .bypassSecurityTrustResourceUrl(`${component.grafanaUrl}orderId=${val.orderId}&var-PM_name=${val.name}&kiosk=tv`)
    });
    expect(component.selectedProcess).toEqual(data);
  });
  it('should change page on search to Default', () => {
    component.onsearchChange('forecast');
    expect(component.inputCurrentpage).toBe(1);
    expect(component.config.currentPage).toBe(1);
  });
  it('should check current and page that has changed', () => {
    component.changepage(0);
    expect(component.inputCurrentpage).toBe(0);
    expect(component.config.currentPage).toBe(0);
  });
  it('should check current and page that has changed', () => {
    component.tempforecastprocess =
      [{ checkboxdata: false }, { checkboxdata: false }];
    const mockObject = {
      target: {
        checked: true,
      }
    };
    component.checkAlls(mockObject);
    const result = component.tempforecastprocess.every(it => it.checkboxdata === true);
    expect(result).toBeTruthy();
  });
  it('should check all checked', () => {
    component.tempforecastprocess = [{ checkboxdata: false }, { checkboxdata: false }];
    component.isAllChecked();
    const result = component.tempforecastprocess.every(_ => _.checkboxdata);
    expect(result).toBeFalsy();
  });
  it('should set the PageSize', () => {
    component.setNewPageSize(5);
    expect(component.config.itemsPerPage).toBe(5);
    expect(component.config.currentPage).toBe(1);
    expect(component.inputCurrentpage).toBe(1);
  });
  it('should Sort the table based on the keys', () => {
    component.sort('name');
    expect(component.key).toBe('name');
    expect(component.reverse).toBe(true);
  });
  it('should change the dropdown values for edit modelparam', () => {
    component.editForecastparam = { Data: 'tets' };
    component.checkmodelparam();
    expect(component.ModelConfigArr.length).toBe(0);
  });
  it('changing the page on user input changepageinp', () => {
    component.config.currentPage = 2;
    component.changepageinp(2, 5);
    expect(component.config.currentPage).toBe(2);
    component.changepageinp(0, 5);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
    component.changepageinp(10, 5);
    expect(component.inputCurrentpage).toBe(component.config.currentPage);
  });
  it('should check editforecast datarangesplit', () => {
    const forcastval = {
      threadId: 3,
  defaultDataRange: 'tsts',
  ne: '1MJF901',
  timeForForwardPrediction: 360,
  jobStatus: 'DELETED', sampleTime: 30,
  modelParameter: 'OPRMIN', podNumber: -1,
  pmId: '1MJF901@1-20-19@OPRMIN@PM_NEAR_END_Rx',
  pmType: 'OPRMIN' };
    const spySuccess = spyOn(component, 'checkmodelparam');
    component.editforecast(forcastval);
    expect(spySuccess).toHaveBeenCalled();
  });
  it('should toggle view', () => {
    const flag = component.toggle;
    component.toggleView();
    expect(component.toggle).toEqual(!flag);
  });
  it('should toggle show', () => {
    const flag = component.isShown;
    component.toggleShow();
    expect(component.isShown).toEqual(!flag);
  });
  it('should set on destroy ', () => {
    component.ngOnDestroy();
    expect(component.forecastService.ForeCastProcessing).toEqual(false);
  });
  it('should set on page load ', () => {
    const spySuccess = spyOn(component, 'getdatatableAPI');
    component.ngOnInit();
    expect(component.forecastService.ForeCastProcessing).toEqual(true);
    expect(spySuccess).toHaveBeenCalled();
  });
  it('should check if Object Exist ', () => {
    const res = component.checkifObjectExist();
    const actual = Object.keys(component.selectedProcess).length === 0 ? false : true;
    expect(res).toEqual(actual);
  });
  it('should check open edit modal', () => {
    const forecastObj = {};
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.opentEditpopup(forecastObj);
    expect(dialogSpy).toHaveBeenCalled();
  });
  it('should check open stop modal', () => {
    const forecastObj = {};
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.openStopmodal(forecastObj);
    expect(dialogSpy).toHaveBeenCalled();
  });
  // it('should check open forecast Edit ', () => {
  //   const temp: any = '1';
  //   expect(component.openforecastEdit(temp)).toThrowError();
  // });
  it('should change the values for edit forecast page', () => {
    component.editForecastparam = { Data: 'tets' };
    component.checkmodelparam();
    expect(component.ModelConfigArr.length).toBe(0);
  });
});


describe('Edit forecost dialog', () => {
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;

  let noop: ComponentFixture<NoopComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule, HttpClientTestingModule, ModalModule.forRoot(), ToastrModule.forRoot()],
      providers: [BsModalService,
        {
          provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }
        },
        { provide: ToastrService, useClass: ToastrService },
        { provide: MatDialogRef, useValue: {} },
          { provide: MAT_DIALOG_DATA, useValue: [] }
      ]
    });

    dialog = TestBed.get(MatDialog);

    noop = TestBed.createComponent(NoopComponent);

  });

  it('shows basic information without details', () => {
    const config = {
    };
    dialog.open(EditForecastprocessingComponent, config);

    noop.detectChanges(); // Updates the dialog in the overlay

    const h2 = overlayContainerElement.querySelector('#dialogTitle');
    const button = overlayContainerElement.querySelector('#dialogDoneBtn');

    expect(h2.textContent).toBe('Modal Configuration ');
    expect(button.textContent).toBe('Done');
  });

  it('shows with some details', () => {
    const elem: any = {
      defaultDataRange: null,
      jobStatus: 'DELETED',
      modelParameter: 'OPRMIN',
      ne: '1MJF901',
      pmId: '1MJF901@1-20-19@OPRMIN@PM_NEAR_END_Rx',
      pmType: 'OPRMIN',
      podNumber: -1,
      sampleTime: 30,
      threadId: 3,
      timeForForwardPrediction: 360,
    };

    const config = {
      data: { forecastEdit: elem }
    };
    dialog.open(EditForecastprocessingComponent, config);

    noop.detectChanges(); // Updates the dialog in the overlay

    const h2 = overlayContainerElement.querySelector('#dialogTitle');
    const button = overlayContainerElement.querySelector('#dialogDoneBtn');
    const sampleTime = overlayContainerElement.querySelector('#sampleTime');
    expect(h2.textContent).toBe('Modal Configuration ');
    expect(button.textContent).toBe('Done');
    expect(sampleTime.textContent).toBe(elem.sampleTime.toString());
  });
});

describe('StopForecastprocessing', () => {
  let dialog: MatDialog;
  let overlayContainerElement: HTMLElement;

  let noop: ComponentFixture<NoopComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule,
        HttpClientTestingModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot()],
      providers: [BsModalService,
        {
          provide: OverlayContainer, useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          }
        },
        { provide: ToastrService, useClass: ToastrService },
      ]
    });

    dialog = TestBed.get(MatDialog);

    noop = TestBed.createComponent(NoopComponent);

  });

  it('shows basic information without details', () => {
    const config = {
    };
    dialog.open(StopForecastProcessComponent, config);

    noop.detectChanges(); // Updates the dialog in the overlay

    const h2 = overlayContainerElement.querySelector('#stopPcTitle');
    const buttonClose = overlayContainerElement.querySelector('#stopPcCBtn');
    const buttonStop = overlayContainerElement.querySelector('#stopPcSBtn');

    expect(h2.textContent).toBe('Stop Forecasting');
    expect(buttonClose.textContent).toBe('Cancel');
    expect(buttonStop.textContent).toBe('Stop');
  });

  it('shows with some details', () => {
    const elem: any = {
      defaultDataRange: null,
      jobStatus: 'DELETED',
      modelParameter: 'OPRMIN',
      ne: '1MJF901',
      pmId: '1MJF901@1-20-19@OPRMIN@PM_NEAR_END_Rx',
      pmType: 'OPRMIN',
      podNumber: -1,
      sampleTime: 30,
      threadId: 3,
      timeForForwardPrediction: 360,
    };

    const config = {
      data: { forecastEdit: elem }
    };
    dialog.open(StopForecastProcessComponent, config);

    noop.detectChanges(); // Updates the dialog in the overlay

    const h2 = overlayContainerElement.querySelector('#stopPcTitle');
    const buttonClose = overlayContainerElement.querySelector('#stopPcCBtn');
    const buttonStop = overlayContainerElement.querySelector('#stopPcSBtn');
    expect(h2.textContent).toBe('Stop Forecasting');
    expect(buttonClose.textContent).toBe('Cancel');
    expect(buttonStop.textContent).toBe('Stop');
  });
});
