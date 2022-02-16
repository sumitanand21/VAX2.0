import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { APP } from 'src/app/constants/app.constants';
import { ANOMALY_URLS } from '../constants/anomaly.constants';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  /*************variable declaration Anomaly***********/
  AnomalyModel = false;
  AnomalyUpdateModel = false;
  AnomalyAllTask = false;
  AnomalySchedule = false;
  AnomalyDetection = false;
  AnomalyView = false;
  AnomalyModelTraining = false;
  AnomalymodelName = '';
  AnomalymodelType = '';
  AnomalyTaskName = '';
  AnomalyModelTrainingName = '';
  AnomalyModelTrainingNameDisp = '';
  AnomalySelectedTrainingModel;
  selectedAnmModel;
  activatedPath = '';
  disableheader = false;
  /*************variable declaration Anomaly Ends***********/

  constructor(private http: HttpClient) { }

  createTask(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.POST_CREATE_TASK_API, data);
  }
  updateTask(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.PUT_UPDATE_TASK_API, data);
  }
  getAnmMdConfigurations(data) {
    // return this.http.get('./assets/res/newcondata.json');
    return this.http.get(APP.BASE_URL + ANOMALY_URLS.GET_ANOMALY_MODEL_CONFIGURATIONS_API, data);
  }
  loadAnmMdConfigMasterData(data, jobType) {
    return forkJoin([this.getAnmMdConfigurations(data), this.getAnomalyDataSets(jobType)]);
  }
  createAnmModel(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.POST_SAVE_ANOMALYMODEL_CONFIG_API, data);
  }
  updateAnmModel(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.PUT_UPDATE_ANOMALYMODEL_CONFIG_API, data);
  }
  getAnomalyDetectionTableData() {
    // return this.http.get('./assets/res/anomalydettable.json');
    return this.http.get(APP.BASE_URL + ANOMALY_URLS.GET_ANMDETECTION_TABLE_DATA_API);
  }
  getAnomalyDetTrainingResultDetails(data) {
    // return this.http.get('./assets/res/amnd1.json');
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANMDETECTION_MODEL_TR_DETAILS_API, data);
  }
  getAnomalyDetDetails(data) {
    // return this.http.get('./assets/res/amnd2.json');
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANMDETECTION_MODEL_ANMD_DETAILS_API, data);
  }
  getAnomalyModelsTableData(data) {
    // return this.http.get('./assets/res/anomalies.json');
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANM_TABLE_DATA_API, data);
  }
  getAnomalyModelsDetails(data) {
    return this.http.get(APP.BASE_URL + ANOMALY_URLS.GET_ANM_MODEL_DETAILS_API);
  }
  getalltasksData() {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ALLTASK_DATA_API, {});
    // return this.http.get('./assets/res/getAllTask.json');
  }
  loadMasterDataForTask(jobType) {
    return forkJoin([this.getAllAnomalyModelConfig(), this.getAnomalyDataSets(jobType)]);
  }
  getAllAnomalyModelConfig() {
    // return this.http.get('./assets/res/1.json');
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANOMALY_MODEL_CONFIG, {});
  }
  getAnomalyDataSets(data) {
     // return this.http.get('./assets/res/getCorrelatonFeatureDataSetList.json');
     // return this.http.get('./assets/res/2.json');
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_DATASET_LIST, data);
  }
  getAnomalyDataSetFeatures(data) {
        // return this.http.get('./assets/res/getDataSetDetails1.json');
     return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_DATA_SOURCE_DETAILS_API, data);
    // return this.http.get('./assets/res/features.json');
  }

  getAnmolayModelConfigByName(data) {
    // return this.http.get('./assets/res/anomalymodelconfigdetails.json');
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANOMALY_MODEL_CONFIG_USING_NAME, data);

    // if(data.modelType == 'MODELI'){
    // return this.http.get('http://localhost:4200/assets/testData/getModelBYNameMODELI.json');
    // }else{
    // return this.http.get('http://localhost:4200/assets/testData/getModelBYNameMODELII.json');
    // }

  }

  deleteAnomalyModelConfig(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.DELETE_ANOMALY_MODEL_CONFIG, data);
    // return this.http.get('http://localhost:4200/assets/testData/deleteModel.json');
  }
  getScheduleDetails(scheduleId) {
     // return this.http.get('./assets/res/task.json');
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_SCHEDULE_DETAILS, scheduleId);
  }

  getTrainedModelDetails(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_TRAINED_MODELS, data);
     // return this.http.get('http://localhost:4200/assets/res/getTrainingModel.json');
  }

  getTrainingStatusDetails(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_TRAINING_STATUS, data);
    // return this.http.get('./assets/res/getTrainingDtatsList.json');
  }
  deleteTrainedModels(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.DELETE_TRAINED_MODELS, data);
  }
  actionOnTask(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.ACTION_ON_TASK, data);
  }
  scheduleDetectAnomaly(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.POST_SCHEDULE_DETECT_ANOMALY_API, data);
  }
  scheduleAnomalyProfiler(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.POST_ANOMALY_SCHEDULE_PROFILING_API, data);
  }
  getAnomalyProfiler(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANOMALY_PROFILING_RESULT_API, data);
  }

  getDataPreview(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.POST_DATAINSIGHT_DATAPREVIEW_API, data);
    // return this.http.get('./assets/res/getDataPreview.json');
  }

  stopTrainedModels(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.DELETE_STOP_TRAINEDMODEL_API, data);
    // return this.http.get('./assets/res/stopTrainedModels.json');
  }

  stopAnomalyDetection(data) {
    return this.http.post(APP.BASE_URL + ANOMALY_URLS.DELETE_STOP_ANOMALYDETECTION_API, data);
    // return this.http.get('./assets/res/stopTrainedModels.json');
  }
}
