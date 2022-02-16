import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { SummaryViewComponent } from './components/summary-view/summary-view.component';
import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  declarations: [SummaryViewComponent, SummaryComponent],
  imports: [
    CommonModule,
    SummaryRoutingModule,
    SharedModule,
    PopoverModule.forRoot(),
    BsDatepickerModule.forRoot()
  ]
})
export class SummaryModule { }
