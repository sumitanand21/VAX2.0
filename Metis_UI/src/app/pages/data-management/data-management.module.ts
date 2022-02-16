import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { DataManagementComponent } from './data-management.component';
import { DataManagementRoutingModule } from './data-management-routing.module';
import { DataPreviewDMComponent } from './components/data-preview-dm/data-preview-dm.component';
import { ConfigurationViewComponent } from './components/configuration-view/configuration-view.component';
import { UpsertConfigurationComponent } from './components/upsert-configuration/upsert-configuration.component';
import { DataSourceComponent } from './components/data-source/data-source.component';
import { UpsertDataSetComponent } from './components/upsert-data-set/upsert-data-set.component';
import { StreamScheduleComponent } from './dialogs/stream-schedule/stream-schedule.component';

@NgModule({
  declarations: [DataManagementComponent,
    DataSourceComponent,
    DataPreviewDMComponent,
    ConfigurationViewComponent,
    UpsertConfigurationComponent,
    UpsertDataSetComponent,
    StreamScheduleComponent],
  imports: [
    CommonModule,
    DataManagementRoutingModule,
    SharedModule
  ],
  entryComponents: [StreamScheduleComponent]
})
export class DataManagementModule { }
