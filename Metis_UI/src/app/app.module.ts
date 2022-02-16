import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';

import { FeatureToggleModule } from 'ngx-feature-toggle';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import {  MatDialogModule } from '@angular/material';
import { DisplaypopupComponent } from './dialogs/displaypopup/displaypopup.component';
import { HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { AppSchedulerService } from './services/app-scheduler.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DisplaypopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FeatureToggleModule,
    HttpClientModule,
    MatDialogModule,
    ToastrModule.forRoot({
      maxOpened: 3,
    }),
  ],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
     {
      provide: APP_INITIALIZER,
      useFactory: (gs: AppSchedulerService) => () => {
        gs.getUrls();
        gs.clearSocketSessions();
      },
      deps: [AppSchedulerService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [DisplaypopupComponent]
})
export class AppModule { }
