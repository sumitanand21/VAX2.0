import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP } from 'src/app/constants/app.constants';
import { FORECAST_URLS } from '../constants/forecast.constants';
import { GlobalService } from 'src/app/services/global.service';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  /*************variable declaration Forecast***********/
  ForeCastSelection = false;
  ForeCastProcessing = false;
  ForecastModel = false;
  ForeCastUpdateModel = false;
  ForecastCompare = false;
  ForecastmodelName = '';
  selectedModelConfig;
  CompareProcess: any = [];
  dataSetId = '';
  headers;
  activatedPath = '';
  /*************variable declaration Forecast Ends***********/
  constructor(private http: HttpClient, private global: GlobalService) { }

  getAllModelConfigs(jobType) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_ALL_MODELCONFIGS_API, jobType);
    // return this.http.get('./assets/res/getallconfigforecast.json');
  }
  forecastProcessingModelDetails(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_FORECASTPROCESSING_MODELCONFIG_DETAILS_API, data);
    // return this.http.get('./assets/res/forecastprocessingdetails.json');
  }
  forecastProcessingtable(data) {
  return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_FORECAST_PROCESSING_API, data);
   // return this.http.get('./assets/res/forecastproctabledata.json');
  }
  datasetname(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_DATASET_LIST, data);
    // return this.http.get('./assets/res/dataset.json');
  }
  ForecastSelectiontable(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_FORECAST_SELECTION_API, data);
    // return this.http.get('./assets/res/forecastselectiontable.json');
  }
  ForecastSelectionUpdatetable(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.UPDATE_FORECAST_SELECTION_TABLE_API, data);
    // return this.http.get('./assets/res/forecastselectiontable.json');

  }
  getModelConfigDetails(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_MODELCONFIG_DETAILS_API, data);
    // return this.http.get('./assets/res/forecastmodelconfigdetails.json');

  }
  updateForecastSelection(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.PUT_UPDATE_FORECASTSELECTION_API, data);
    // return this.http.get('./assets/res/forecastselectiontable.json');
  }
  saveForecastSelection(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.POST_SAVE_FORECASTSELECTION_API, data);
    // return this.http.get('./assets/res/forecastselectiontable.json');
  }
  handleForecastProcessing(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.PUT_HANDLE_FORECASTPROCESSING_API, data);
  }

  getModelConfigUpdateDetails(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_MODELCONFIG_DETAILS_API, data);
    // return this.http.get('./assets/res/forecastmodelconfigdetails.json');
  }

  createModelConfigDetails(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.POST_CREATE_FORECASTMODELCONFIG_API, data);
  }
  UpdateModelConfigDetails(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.PUT_UPDATE_FORECASTMODELCONFIG_API, data);
  }

  deleteModelConfigDetails(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.DELETE_REMOVE_FORECASTMODELCONFIG_API, data);
  }
  getConfigurationModelConfig() {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_DROPDOWN_FORECASTMODELCONFIG_API, {});
    // return this.http.get('./assets/res/getmodelconfigdetails.json');
  }

  scheduleSelectionDetails(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.PUT_SCHEDULE_FORECASTSELECTION_API, data);
  }

  getForecastCompareDetails(data) {
    return this.http.post(APP.BASE_URL + FORECAST_URLS.POST_FETCH_FORECASTCOMPARE_API, data);
    // return this.http.get('./assets/res/forecastcomparedata.json');
  }
  getModelConfig() {
    return this.http.get(this.global.baseURL + this.global.forecastModelConfig).map((res: Response) => res.json());
  }
}
