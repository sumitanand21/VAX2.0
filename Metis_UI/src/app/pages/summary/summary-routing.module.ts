import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryViewComponent } from './components/summary-view/summary-view.component';
import { SummaryComponent } from './summary.component';

const routes: Routes = [
  { path: '', component: SummaryComponent ,
  children: [
    { path: '', component: SummaryViewComponent},
  ]}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryRoutingModule { }
