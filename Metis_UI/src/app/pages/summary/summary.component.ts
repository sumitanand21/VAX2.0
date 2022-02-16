import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SummaryService } from './services/summary.service';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {
  dataSetLoader = false;
  dateRangeValue: any;
  datepickerConfig: any;
  endRangeValue: any;
  startRangeValue: any;
  timeFrameValue: any = '15m';
  timeFrameDesc: any = 'Last 15 mins';
  showDates: Boolean = false;
  dateChangedStatus: Boolean = true;
  userInputRefreshTime: Number = 1;
  userInputTimeType: any = 'sec';
  selectedUrl: any = '';
  options = '';
  datasetDropdown = [];
  // datasetDropdown = [{
  //   key: 'lte_data',
  //   value: 'https://167.254.204.64:32101/app/dashboards#/view/0d6f64e0-74dd-11ea-8d7d-91c2872ae7d2?embed=true&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:now-15m,to:now))&show-query-input=true&show-time-filter=true%22&_a=(description:\'\',filters:!(),fullScreenMode:!f,options:(hidePanelTitles:!f,useMargins:!t),query:(language:kuery,query:\'\'),timeRestore:!f,title:Summary,viewMode:view)'
  // }];
  constructor(public summaryService: SummaryService, public sanitizer: DomSanitizer,
              private router: Router,
              private notify: NotificationService) {
  }

  ngOnInit() {
    this.getDataSet();
  }
  datasetChange(selectedDataset) {
    const selectedObj = this.datasetDropdown.filter(it => it.key === selectedDataset);
    this.selectedUrl = selectedObj.length > 0 ? this.sanitizer.bypassSecurityTrustResourceUrl(selectedObj[0].value) : '';
  }

  getDataSet() {
    this.dataSetLoader = true;
    const JobType = { jobType: 'SUMMARY' };
    this.summaryService.dataSetName(JobType).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.datasetDropdown = res.data && res.data.data && res.data.data.length > 0 ? [...res.data.data] : [];
        // tslint:disable-next-line:max-line-length
        this.options = this.datasetDropdown.length > 0 ? this.datasetDropdown[0] : '';

        this.getIframeDetails(this.options);
      } else {
        this.datasetDropdown = [];
        this.getIframeDetails(null);
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set');
      }
      this.dataSetLoader = false;
    }, err => {
      this.dataSetLoader = false;
      this.getIframeDetails(null);
      this.datasetDropdown = [];
      this.notify.showToastrError('Alert', 'API failed to fetch data set');
    });
  }

  getIframeDetails(selectedDataSet) {
    if (selectedDataSet) {
      this.dataSetLoader = true;
      const data = { dataSetName: selectedDataSet };
      this.summaryService.getSummaryDetails(data).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.selectedUrl = res.data && res.data.data && res.data.data.url ?
            this.sanitizer.bypassSecurityTrustResourceUrl(res.data.data.url) : '';
        } else {
          this.selectedUrl = '';
          this.notify.showToastrWarning('Alert', 'API failed to fetch details');
        }
        this.dataSetLoader = false;
      }, err => {
        this.dataSetLoader = false;
        this.selectedUrl = '';
        this.notify.showToastrError('Alert', 'API failed to fetch details');
      });
    } else {
      this.selectedUrl = '';
    }
  }

}
