import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { AnomalyService } from './services/anomaly.service';
import { SessionService } from 'src/app/auth/session.service';
import { SOCKET_FEATURE } from 'src/config/app.cofig';
import { SESSION } from 'src/app/constants/app.constants';
@Component({
  selector: 'app-anomaly',
  templateUrl: './anomaly.component.html',
  styleUrls: ['./anomaly.component.css']
})
export class AnomalyComponent implements OnInit, AfterViewChecked {

  constructor(
    public anomalyService: AnomalyService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private sessionStorage: SessionService) {
    this.sessionStorage.setKeyValue(SESSION.FEATURE, SOCKET_FEATURE.ANOMALY);
    this.anomalyService.activatedPath = this.router.url;
  }

  showTabView = true;
  ngOnInit() {
  }

  ngAfterViewChecked() {

    if (this.anomalyService.AnomalyAllTask ||
      this.anomalyService.AnomalySchedule ||
      this.anomalyService.AnomalyDetection ||
      this.anomalyService.AnomalyView) {
      this.showTabView = true;
    } else {
      this.showTabView = false;
    }

    this.cdref.detectChanges();

  }
  anomalyNavigation(navigationpath, newConfig?) {
    if (newConfig) {
      switch (newConfig) {
        case 1:
          if (this.anomalyService.AnomalyAllTask) {
            navigationpath = navigationpath.replace('_page_', 'alltask');
          } else if (this.anomalyService.AnomalyDetection) {
            navigationpath = navigationpath.replace('_page_', 'anomalydetection');
          } else if (this.anomalyService.AnomalyView) {
            navigationpath = navigationpath.replace('_page_', 'anomalyview');
          }
          break;

        case 2:
          navigationpath = this.anomalyService.activatedPath + '/' + navigationpath;
          break;

        case 3:
          navigationpath = this.anomalyService.activatedPath.replace('/upsertmodelconfig', '');
          break;

      }
    }
    this.anomalyService.activatedPath = navigationpath;
    this.router.navigate([navigationpath]);
  }

}
