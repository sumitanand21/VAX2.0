import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastRoutingModule } from './forecast-routing.module';
import { SharedModule } from '../../shared/shared.module';

import {
  ForecastSelectionComponent,
  EditForecastselectionComponent
} from './components/forecast-selection/forecast-selection.component';
import {
  ForecastProcessingComponent,
  EditForecastprocessingComponent
} from './components/forecast-processing/forecast-processing.component';
import { ForecastCompareComponent } from './components/forecast-compare/forecast-compare.component';
import { ModelconfComponent } from './components/modelconf/modelconf.component';
import { UpdateModelconfigComponent } from './components/update-modelconfig/update-modelconfig.component';
import { ForecastComponent } from './forecast.component';
import { StopForecastProcessComponent } from './dialogs/stop-forecast-process/stop-forecast-process.component';

@NgModule({
  declarations: [
    ForecastComponent,
    ForecastSelectionComponent,
    ForecastProcessingComponent,
    ForecastCompareComponent,
    ModelconfComponent,
    EditForecastselectionComponent,
    EditForecastprocessingComponent,
    StopForecastProcessComponent,
    UpdateModelconfigComponent,
  ],
  imports: [
    CommonModule,
    ForecastRoutingModule,
    SharedModule,
  ],
  entryComponents: [EditForecastselectionComponent,
    EditForecastprocessingComponent,
    StopForecastProcessComponent],

})
export class ForecastModule { }
