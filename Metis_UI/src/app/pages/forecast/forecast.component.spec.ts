import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastComponent } from './forecast.component';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { MatDialogModule } from '@angular/material';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { APP_BASE_HREF } from '@angular/common';
const routes: Routes = [

];
describe('ForecastComponent', () => {
  let component: ForecastComponent;
  let fixture: ComponentFixture<ForecastComponent>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
  let httpMock: HttpTestingController;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForecastComponent],
      imports: [HttpClientTestingModule, MatDialogModule, RouterModule.forRoot(routes), ModalModule.forRoot(), ToastrModule.forRoot()],
      providers: [BsModalService,
        { provide: ToastrService, useClass: ToastrService },
        { provide: Router, useValue: routerSpy },
        {provide: APP_BASE_HREF, useValue : '/' }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate to model configuration page by cleaing saved Values', () => {
    const navigatePath = '/forecast/modelconfig';
    component.forecastNavigation(navigatePath, true);
    expect(routerSpy.navigate).toHaveBeenCalledWith([navigatePath]);
  });

  it('should navigate to forecast pages', () => {
    const navigatePath = '/forecast/updateconfig';
    component.forecastNavigation(navigatePath);
    expect(routerSpy.navigate).toHaveBeenCalledWith([navigatePath]);
  });

});
