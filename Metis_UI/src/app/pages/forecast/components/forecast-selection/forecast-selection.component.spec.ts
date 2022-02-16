import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { EditForecastselectionComponent, ForecastSelectionComponent } from './forecast-selection.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { MatDialog, MatDialogModule } from '@angular/material';
import { DatePipe } from '@angular/common';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ForecastService } from '../../services/forecast.service';
import { AlphaNumericDirective } from 'src/app/directives/alpha-numeric.directive';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ForecastSelectionComponent', () => {
  let component: ForecastSelectionComponent;
  let fixture: ComponentFixture<ForecastSelectionComponent>;
  // tslint:disable-next-line:prefer-const
  let headText;
  // tslint:disable-next-line:prefer-const
  let forecastService: ForecastService;
  let dialogSpy: jasmine.Spy;
  let httpMock: HttpTestingController;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  dialogRefSpyObj.componentInstance = { body: '' };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForecastSelectionComponent, AlphaNumericDirective],
      imports: [HttpClientTestingModule, FormsModule, MatSelectModule,
        MatInputModule, NgxPaginationModule, FilterPipeModule,
        Ng2SearchPipeModule, OrderModule, ModalModule.forRoot(),
        ToastrModule.forRoot(), BrowserAnimationsModule, MatDialogModule],
      providers: [DatePipe, BsModalService,
        { provide: ToastrService, useClass: ToastrService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastSelectionComponent);
    forecastService = TestBed.get(ForecastService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have called model function', () => {
    const spyGetModel = spyOn(component, 'getdatatableAPI');
    component.ngOnInit();
    expect(spyGetModel).toHaveBeenCalled();
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
    component.tempforecast = [{ checkboxdata: false }, { checkboxdata: false }];
    const mockObject = {
      target: {
        checked: true,
      }
    };
    component.checkAlls(mockObject);
    const result = component.tempforecast.every(it => it.checkboxdata === true);
    expect(result).toBeTruthy();
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
    expect(component.ModelConfigArr.length).toBe(1);
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

  it('should check open modal', () => {
    const forecastObj = {};
    dialogSpy = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    component.opentEditpopup(forecastObj);
    expect(dialogSpy).toHaveBeenCalled();

    // You can also do things with this like:
    expect(dialogSpy).toHaveBeenCalled();

  });
  // editforecast
});



describe('EditForecastselectionComponent', () => {
  let component: EditForecastselectionComponent;
  let fixture: ComponentFixture<EditForecastselectionComponent>;
  const valueArr = [{ id: 1 }, { id: 2 }];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditForecastselectionComponent],
      imports: [HttpClientTestingModule, FormsModule,
        MatSelectModule, MatInputModule, NgxPaginationModule,
        FilterPipeModule, Ng2SearchPipeModule, OrderModule,
        ModalModule.forRoot(), ToastrModule.forRoot(),
        BrowserAnimationsModule, MatDialogModule],
      providers: [DatePipe, BsModalService,
        { provide: ToastrService, useClass: ToastrService }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditForecastselectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
