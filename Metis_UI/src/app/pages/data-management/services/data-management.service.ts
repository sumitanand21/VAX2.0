import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { APP } from 'src/app/constants/app.constants';
import { DATAMANAGEMENT_URLS } from '../constants/data-management.constants';
import { GlobalService } from 'src/app/services/global.service';
@Injectable({
  providedIn: 'root'
})
export class DataManagementService {
  showDataSource = false;
  showDataPreview = false;
  showUpsertDataSet = false;
  showConfiguration = false;
  showUpsertConfiguration = false;
  selectedConfigurationName: '';
  selectedConfiguration: any = {};
  selectedDataSetName = '';

  constructor(private http: HttpClient, private global: GlobalService) { }

  getConfigurationTableData(data) {
   return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_CONFIGURATION_TABLEVIEW_API, data);
    // return this.http.get('./assets/res/getConfiguration.json');
  }

  getConfigurationViewDetails(data) {
   return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_CONFIGURATION_DETAILEDVIEW_API, data);
    // return this.http.get('./assets/res/getConfigDetails.json');
  }
  createConfigurationData(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.CREATE_CONFIGURATION_API, data);
    // return this.http.get('./assets/res/getConfiguration.json');
  }
  createNewDataType(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.CREATE_NEWDBYTYPE_API, data);
    // return this.http.get('./assets/res/getConfiguration.json');
  }
  deleteConfiguration(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.DELETE_CONFIGURATION, data);
    // return this.http.get('./assets/res/deleteConfiguration.json');
  }
  getDBList(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_CONFIGURATION_DBTYPE_API, data);
    // return this.http.get('./assets/res/getConfigDBtype.json');
  }
  getDatasourceList() {
    // return this.http.get('./assets/res/getdatasourceList.json');
    return this.http.get(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATA_SOURCE_LIST_API);
  }
  getDatasourceDeatils(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATA_SOURCE_DETAILS_API, data);
    // return this.http.get('./assets/res/getDataSetDetails1.json');
  }
  deleteDatasource(data) {
    // return this.http.get('./assets/res/getDataSetDetails1.json');
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.DELETE_DATA_SOURCE_API, data);
  }
  getConfigurationList(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATAINSIGHT_CONFIGURATION_API, data);
    // return this.http.get('./assets/res/getConfigurationList.json');
  }

  getConfigurationDet(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATAINSIGHT_CONFIGDET_API, data);
    // return this.http.get('./assets/res/getConfigurationDet.json');
  }

  getJobType(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATAINSIGHT_JOBTYPE_API, data);
    // return this.http.get('./assets/res/getJobType.json');
  }

  getPropertyType(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATAINSIGHT_PROPERTYTYPE_API, data);
    // return this.http.get('./assets/res/getPropertyType.json');
  }

  getDataPreview(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_DATAPREVIEW_API, data);
    // return this.http.get('./assets/res/getDataPreview.json');
  }

  getStepsDetails(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_STEPS_API, data);
    // return this.http.get('./assets/res/getStepDetails2.json');
    // return this.http.get('./assets/res/getStepDetails.json');
  }

  getFeatureDet(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_FETCH_FEATURES_API, data);
    // return this.http.get('./assets/res/FetchFeature.json');
  }

  createDataSet(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_CREATE_DATA_SET_API, data);
    // return this.http.get('./assets/res/FetchFeature.json');
  }

  updateDataSet(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.PUT_DATAINSIGHT_UPDATE_DATA_SET_API, data);
    // return this.http.get('./assets/res/FetchFeature.json');
  }

  fileUpload(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_FILE_UPLOAD_API, data);
    // return this.http.get('./assets/res/FileUpload.json');
  }

  updateConfiguration(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.UPDATE_CONFIGURATION, data);
    // return this.http.get('./assets/res/getConfiguration.json');
  }

  streamDataSchedule(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_STREAM_SCHEDULE_API, data);
    // return this.http.get('./assets/res/FileUpload.json');
  }

  getstreamDataSchedule(data) {
    return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATAINSIGHT_STREAM_SCHEDULE_API, data);
    // return this.http.get('./assets/res/getStreamSchedule.json');
  }
}
