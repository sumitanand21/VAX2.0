import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP } from 'src/app/constants/app.constants';
import { CLASSIFICATION_URLS } from '../constants/classification.constants';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  classificationDetails: any = {};
  scheduleRes: any = {};
  constructor(private http: HttpClient) { }

  getProfilerTableData(data) {
    return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_PROFILER_RESULT, data);
  }

  getFeatureDataSetProf(data) {
    return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_DATASET_LIST, data);
    // return this.http.get('./assets/res/getCorrelatonFeatureDataSetList.json');
  }

  getFeatureGroupProf(data) {
    return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_CLASSIFICATION_DATASET_FEATURE_GROUPS_API, data);
    // return this.http.get('./assets/res/getClassificationFeatureGroupList.json');
  }

  getFeaturesTimeColumnProf(data) {
    return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_CLASSIFICATION_DATASET_TIME_COLUMNS_API, data);
    // return this.http.get('./assets/res/getTimeColumns.json');
  }

  getALLFeaturesListProf(data) {
    return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_CLASSIFICATION_DATASET_FEATURE_MAPPINGS_API, data);
    // return this.http.get('./assets/res/getAllFeatureForDataSet.json');
  }

  getALLFeaturesListByGroupProf(data) {
    return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.POST_CLASSIFICATION_DATASET_GROUP_DETAILS_API, data);
    // return this.http.get('./assets/res/getClassificationFeatureByGroup.json');
  }

  updateFeatureGroupProf(data) {
    return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.PUT_CLASSIFICATION_UPDATE_FEATURE_GROUP_API, data);
    // return this.http.get('./assets/res/UpsertClassification.json');
  }

  createFeatureGroupProf(data) {
    return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.POST_CLASSIFICATION_CREATE_FEATURE_GROUP_API, data);
    // return this.http.get('./assets/res/UpsertClassification.json');
  }
  scheduleProfiler(data) {
    return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.PUT_SCHEDULE_PROFILER_API, data);
    // return this.http.get('./assets/res/getAllTask.json');
  }

  getProfDatasourceDeatils(data) {
    return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_DATA_SOURCE_DETAILS_API, data);
    // return this.http.get('./assets/res/getDataSetDetails1.json');
  }

  deleteFeatureGroupProf(data) {
    return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.DELETE_CLASSIFICATION_FEATURE_GROUP_API, data);
    // return this.http.get('./assets/res/UpsertClassification.json');
  }
}
