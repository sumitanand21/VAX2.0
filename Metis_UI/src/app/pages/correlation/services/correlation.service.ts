import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { APP } from 'src/app/constants/app.constants';
import { CORRELATION_URLS } from '../constants/correlation.constants';
import { GlobalService } from 'src/app/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class CorrelationService {
  correlationDetails: any = {};
  groupDetils: any = {};
  disableSlider = false;
  constructor(private http: HttpClient, private global: GlobalService) { }
  getCorrelationTableViewData(correlationType: any) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_CORRELATION_TABLE_VIEW_DATA, correlationType);
    // return this.http.get('./assets/res/getCorrelationTableViewData.json');
  }
  getCorrelationPlotData(data) {
    // return this.http.get('./assets/res/scatterplotter.json');
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.POST__SCATTERPLOTTER_API, data);
  }
  getCorrelationHeatMap(data) {
    // return this.http.get('./assets/res/heatmap.json');
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.POST__HEATMAP_API, data);
  }
  getPartionedChartData(data) {
    // return this.http.get('./assets/res/partionedchart.json');
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.POST__PARTIONEDCHART_API, data);
  }

  getFeatureDataSet(data) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_DATASET_LIST, data);
    // return this.http.get('http://localhost:4200/assets/res/getCorrelatonFeatureDataSetList.json');
  }

  getFeatureGroup(data) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_CORRELATION_DATASET_FEATURE_GROUPS_API, data);
    // return this.http.get('http://localhost:4200/assets/res/getCorrelationFeatureGroupList.json');
  }

  getFeaturesTimeColumn(data) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_CORRELATION_DATASET_TIME_COLUMNS_API, data);
    // return this.http.get('http://localhost:4200/assets/res/getTimeColumns.json');
  }

  getALLFeaturesList(data) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_CORRELATION_DATASET_FEATURE_MAPPINGS_API, data);
    // return this.http.get('http://localhost:4200/assets/res/getAllFeatureForDataSet.json');
  }

  getALLFeaturesListByGroup(data) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.POST_CORRELATION_DATASET_GROUP_DETAILS_API, data);
    // return this.http.get('http://localhost:4200/assets/res/getFeatureByGroup.json');
  }

  upsertFeatureGroup(data) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.PUT_CORRELATION_UPDATE_FEATURE_GROUP_API, data);
    // return this.http.get('http://localhost:4200/assets/res/getAllTask.json');
  }

  getCorrelationListData(correlationType: any) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_CORRELATION_LIST_DATA, correlationType);
    // return this.http.get('./assets/res/getCorrelationListData.json');
  }
  getCorrelatedGroupsViewTableData() {
    return this.http.get('./assets/res/getCorrelationTableViewData.json');
  }

  getPositiveGroupsData(data: any) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_POSITIVE_GROUPS, data);
    // return this.http.get('./assets/res/getPositiveCorrelationGroup.json');
  }
  getNegativeGroupsData(data: any) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_NEGATIVE_GROUPS, data);
    // return this.http.get('./assets/res/getNegativeCorrelationGroup.json');
  }
  getGroupsDetailsData(data) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_GROUP_DETAILS, data);
    // return this.http.get('./assets/res/getGroupdetailsData.json');
  }

  getCorrelatedDatasourceDeatils(data) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_DATA_SOURCE_DETAILS_API, data);
    // return this.http.get('./assets/res/getDataSetDetails1.json');
  }

  deleteCorrelatedGroup(data) {
    return this.http.post(APP.BASE_URL + CORRELATION_URLS.POST_CORRELATION_DELETE_GROUP_API, data);
    // return this.http.get('./assets/res/getDataSetDetails1.json');
  }
}
