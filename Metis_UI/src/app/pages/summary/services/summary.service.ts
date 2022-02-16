import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP } from 'src/app/constants/app.constants';
import { SUMMARY_URLS } from '../constants/summary.constants';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  schedularApiStatus: boolean;
  anomalyApiStatus: boolean;
  refreshInterval: any;
  kibanaDashboardURLTime: any;
  kibanaStatusURLTime: any;
  kibanaURLTailingEndTime: any;
  urlTimezoneEnding: any;
  urlMid: any;
  constructor(private http: HttpClient) {
    this.schedularApiStatus = false;
    this.anomalyApiStatus = false;
    this.refreshInterval = '5000';
    // tslint:disable-next-line:max-line-length
    this.kibanaDashboardURLTime = 'http://167.254.204.97:30099/app/kibana#/dashboard/3026e430-06d4-11ea-a9ca-65b3eaec39bb?embed=true&_g=(refreshInterval%3A(pause%3A!f%2Cvalue%3A' + this.refreshInterval + ')%2Ctime%3A(from%3A';
    // tslint:disable-next-line:max-line-length
    this.kibanaStatusURLTime = 'http://167.254.204.97:30099/app/kibana#/dashboard/5d68ead0-104b-11ea-a9ca-65b3eaec39bb?embed=true&_g=(refreshInterval%3A(pause%3A!f%2Cvalue%3A' + this.refreshInterval + ')%2Ctime%3A(from%3A';
    this.kibanaURLTailingEndTime = '%2Cto%3Anow))';
    this.urlTimezoneEnding = 'T06%3A30%3A00.000Z';
    this.urlMid = '%2Cto%3A';
  }

  dataSetName(data) {
    return this.http.post(APP.BASE_URL + SUMMARY_URLS.GET_DATASET_LIST, data);
    // return this.http.get('./assets/res/getCorrelatonFeatureDataSetList.json');
  }

  getSummaryDetails(data) {
    return this.http.post(APP.BASE_URL + SUMMARY_URLS.GET_SUMMARY_DETAILS_API, data);
    // return this.http.get('./assets/res/getSummaryDetails.json');
  }
}
