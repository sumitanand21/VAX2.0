import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelconfComponent } from './modelconf.component';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/libs/material/material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { APP_BASE_HREF } from '@angular/common';
import { DisplaypopupComponent } from 'src/app/dialogs/displaypopup/displaypopup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TestModule } from 'src/app/test/test.module';
const routes: Routes = [

];
describe('ModelconfComponent', () => {
  let component: ModelconfComponent;
  let fixture: ComponentFixture<ModelconfComponent>;
  const valueArr = [{ id: 1 }, { id: 2 }];
  // let toasterServiceSpy: jasmine.Spy;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ModelconfComponent],
      imports: [MaterialModule, NgxPaginationModule,
        FilterPipeModule,
        Ng2SearchPipeModule, OrderModule,
        HttpClientTestingModule, RouterModule.forRoot(routes),
        SharedModule,
        TestModule,
        FormsModule, ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [
        { provide: ToastrService, useClass: ToastrService },
        { provide: Router, useValue: routerSpy },
        {provide: APP_BASE_HREF, useValue : '/' }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelconfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have selected Model Object', () => {
    const spySuccess = spyOn(component, 'loadAllModelConfigs');
    component.ngOnInit();
    expect(spySuccess).toHaveBeenCalled();
  });

  it('should not have selected Model Object', () => {
    const selectedVal = {};
    component.modelDetails = [];
    component.ngOnInit();
    expect(component.selectedModelObject).toEqual(selectedVal);
  });


  it('should change selected Model Object', () => {
    const selectedVal = { id: 1 };
    component.displayModel(selectedVal);
    expect(component.selectedModel).toEqual(selectedVal);
  });
  it('should delete Model', () => {
    component.modelDetails = [...valueArr];
    const selectedVal = { id: 1 };
    const modelLength = component.modelDetails.length;
    component.deleteModelConfig(1);
    expect(component.modelDetails.length).toBe(modelLength);
    expect(component.selectedModel).toEqual(undefined);
    component.deleteModelConfig(2);
    expect(component.modelDetails.length).toBe(2);
    expect(component.selectedModelObject).toEqual({});

  });

  it('should navigate to update page', () => {
    const navPat = '/forecast/updateconfig';
    const navigatePath = [['/forecast/updateconfig'], Object({queryParams: Object({name: undefined})})];
    const modelval = { id: 1 };
    component.navigateTo(navPat, modelval);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/forecast/updateconfig'], Object({queryParams: Object({name: undefined})}));
  });

  it('should check for model Object present', () => {
    component.selectedModelObject = { id: 1 };
    const result = component.checkifObjectExist();
    expect(result).toBeTruthy();
  });

  it('should check for model Object not present', () => {
    component.selectedModelObject = {};
    const result = component.checkifObjectExist();
    expect(result).toBeFalsy();
  });

});
