import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelConfigViewComponent } from '../../dialogs/model-config-view/model-config-view.component';
import { MatDialog } from '@angular/material';
import { AnomalyService } from '../../services/anomaly.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AppSchedulerService } from 'src/app/services/app-scheduler.service';
import { PATHS, SUBSCRIPTIONS } from 'src/app/constants/app.constants';
import { GlobalService } from 'src/app/services/global.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-anomaly-detection',
  templateUrl: './anomaly-detection.component.html',
  styleUrls: ['./anomaly-detection.component.css']
})
export class AnomalyDetectionComponent implements OnInit, AfterViewChecked, OnDestroy {
  tableData;
  p = 1;
  Loader = true;
  headers: any;
  showFirst: any;
  closeforecastEdit: any;
  forecastData: any[];
  tempAnomalyDetections: any[] = [];
  tempforecast: any[];
  ModelConfigArr: any = [];
  modalEditRef: BsModalRef;
  socket;
  foretableLength: any = 0;
  forecastDisabled = true;
  editforecastObject: any;
  editforecastName: any;
  threadId: any;
  editSampletime: any;
  mintime: any;
  maxtime: any;
  toggle = false;
  editid: any;
  editne: any;
  pmType: any;
  podNumber: any;
  jobStatus: any;
  editForecastparam: any;
  frwrdPredict: any;
  editSeconds: any;
  editMinutes: any;
  editHours: any;
  editDays: any;
  all: any;
  elUrl: any;
  getCallData: any;
  forecast: any;
  sample: any;
  input: any;
  edittemplate: any;
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  key = 'name';
  reverse = false;
  isShown = true;
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage: number = this.defauultItempg;
  inputCurrentpage: number = this.defaultCurrentPage;
  searchFilter = '';
  defaultJobType = 'FORECAST';
  dataSetList;
  anmdStatusList;
  modelTypeList = [];
  // dataSetSelected;
  anmdStatusSelected = '';
  modelTypeSelected = '';
  featureCount = 38;
  selectionDataSet = [{ id: '1', name: 'selction 1' }, { id: '2', name: 'selction 2' }, { id: '2', name: 'selction 2' }];
  pageArr = [25, 50, 100];
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  disableDetectAnomalyBtn = false;
  anmdTrResLoading = false;
  anmdDetailsLoading = false;
  selectedModel: any = {};
  selectedModelAnmdDATA: any = {};
  selectedModelTrainingData: any = {};
  trTab = true;
  isLoading = false;
  datasetView = '';
  dataSetSelected = '';
  searchFilterTask = '';
  selectedModelType = '';
  anomaltDetectedData;
  AlltasksFilter = {
    modelName: this.searchFilter

  };

  constructor(
    public anomalyService: AnomalyService,
    private notify: NotificationService,
    private appScheduler: AppSchedulerService,
    public sanitizer: DomSanitizer,
    public global: GlobalService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.anomalyService.AnomalyDetection = true;
    this.loadTableData();
  }

  ngAfterViewChecked() {
    if (this.isLoading || this.anmdTrResLoading || this.anmdDetailsLoading) {
      this.anomalyService.disableheader = true;
    } else {
      this.anomalyService.disableheader = false;
    }
  }

  loadTableData() {
    this.isLoading = true;
    this.anomalyService.getAnomalyDetectionTableData().subscribe((res: any) => {
      this.isLoading = false;
      if (res.status === 'success') {
        if (res.elUrl) {
          this.elUrl = res.elUrl;
        }
        this.tempAnomalyDetections = res.data.map(x => {
          if (x.modelName && x.modelName.includes('.')) {
            const modList = x.modelName.split('.');
            x.modelNameDisp = modList[0];
          } else {
            x.modelNameDisp = x.modelName;
          }
          if (x.accuracy && x.accuracy.length && x.accuracy.length > 0) {
            if (x.accuracy[x.accuracy.length - 1] && !isNaN(Number(x.accuracy[x.accuracy.length - 1]))) {
              x.accuracyDisp = Math.round(x.accuracy[x.accuracy.length - 1] * 1000) / 1000;
              if (x.accuracyDisp === 1) {
                x.accuracyDisp = Math.floor(x.accuracy[x.accuracy.length - 1] * 1000) / 1000;
              }
            } else {
              x.accuracyDisp = 'NA';
            }
          }

          return x;
        });
        this.displayModel(this.tempAnomalyDetections[0]);
        this.setDrapdownValues();
        this.scheduleSoc('5s');
      }
    }, (error) => {
      this.isLoading = false;
    });
  }
  openModelConfigDialog(model) {
    const dialogRef = this.dialog.open(ModelConfigViewComponent, {
      width: '90%',
      maxHeight: '80vh',
      // tslint:disable-next-line:object-literal-shorthand
      data: { modelConfigName: model.modelConfigName, modelType: model.modelType }
    });


    dialogRef.afterClosed().subscribe(res => {

    });
  }
  getAnomalyDetectBtnStatus(): boolean {
    let btnStatus = false;
    if (this.tempAnomalyDetections && this.tempAnomalyDetections.length &&
      this.tempAnomalyDetections.length > 0 && this.selectedModel && this.selectedModel.modelType) {
      const res = this.tempAnomalyDetections.filter(elem => elem.modelType === this.selectedModel.modelType
        && this.selectedModel.dataSetName === elem.dataSetName && elem.jobStatus.toLowerCase() !== 'completed'
        && this.selectedModel.modelName !== elem.modelName);
      if (res && res.length && res.length > 0) {
        btnStatus = true;
      }
    }
    return btnStatus;
  }
  setDrapdownValues() {
    this.dataSetList = [];
    this.dataSetSelected = '';
    const dataSetListTemp = this.tempAnomalyDetections.filter((thing, i, arr) => {
      return arr.indexOf(arr.find(t => t.dataSetName.toLowerCase() === thing.dataSetName.toLowerCase())) === i;
    }).map((elem, i) => {
      return elem.dataSetName;
    });
    this.dataSetList = [...dataSetListTemp];

    this.anmdStatusList = [];
    this.anmdStatusSelected = '';
    const anmdStatusListTemp = this.tempAnomalyDetections.filter((thing, i, arr) => {
      return arr.indexOf(arr.find(t => t.jobStatus.toLowerCase() === thing.jobStatus.toLowerCase())) === i;
    }).map((elem, i) => {
      return elem.jobStatus;
    });
    this.anmdStatusList = [...anmdStatusListTemp];
    this.modelTypeList = [];

    this.modelTypeSelected = '';
    const modelTypeListTemp = this.tempAnomalyDetections.filter((thing, i, arr) => {
      return arr.indexOf(arr.find(t => t.modelType.toLowerCase() === thing.modelType.toLowerCase())) === i;
    }).map((elem, i) => {
      return elem.modelType;
    });
    this.modelTypeList = [...modelTypeListTemp];
  }
  statusChange() {
    this.clearSelection();
  }
  modeltypeChange() {
    this.clearSelection();
  }
  datasetChange() {
    this.clearSelection();
  }
  checkAlls(ev) {
    this.tempAnomalyDetections.forEach(x => x.checkboxdata = ev.target.checked);
  }

  isAllChecked() {
    return this.tempAnomalyDetections.every(_ => _.checkboxdata);
  }
  checkifObjectExist(selectedModel) {
    return selectedModel && Object.keys(selectedModel).length > 0 ? true : false;

  }
  setSelectedModelDetails(data) {
    // this.selectedModel = {
    //   modelType: data.modelType ? data.modelType : this.selectedModel.modelType,
    //   lossFunction: data.lossFunction ? data.lossFunction : this.selectedModel.lossFunction,
    //   modelConfigName: data.modelConfigName ? data.modelConfigName : this.selectedModel.modelConfigName,
    //   dataSetName: data.dataSetName ? data.dataSetName : this.selectedModel.dataSetName,
    //   accuracy: data.accuracy ? data.accuracy : this.selectedModel.accuracy,
    //   jobStatus: this.selectedModel.jobStatus,
    //   threshold: data.threshold ? data.threshold : this.selectedModel.threshold
    // };
    this.selectedModel.threshold = data.threshold ? data.threshold : this.selectedModel.threshold;
  }
  displayModel(anmdModel) {
    if (anmdModel) {
      this.anmdTrResLoading = true;
      this.selectedModelTrainingData = {};
      this.selectedModelAnmdDATA = {};
      this.selectedModel = anmdModel;
      this.setUrl();
      this.selectedModel.threshold = 0.001;
      this.getAnomalyDetectionResult(anmdModel);
      const data = { modelId: anmdModel.uid };
      this.anomalyService.getAnomalyDetTrainingResultDetails(data).subscribe((res: any) => {
        this.anmdTrResLoading = false;
        if (res.status === 'success' && res.data) {
          this.selectedModelTrainingData = res.data;
          if (this.selectedModelTrainingData.accuracy &&
            this.selectedModelTrainingData.accuracy.length && this.selectedModelTrainingData.accuracy.length > 0) {
            this.selectedModelTrainingData.accuracyDisp =
              this.selectedModelTrainingData.accuracy[this.selectedModelTrainingData.accuracy.length - 1];
          }
          if (this.selectedModelTrainingData.numberOfComponents &&
            this.selectedModelTrainingData.numberOfComponents.length && this.selectedModelTrainingData.numberOfComponents.length > 0) {
            this.selectedModelTrainingData.numberOfComponentsDisp =
              !isNaN(Number(
                this.selectedModelTrainingData.numberOfComponents[this.selectedModelTrainingData.numberOfComponents.length - 1]
              ))
                ?
                this.selectedModelTrainingData.numberOfComponents[this.selectedModelTrainingData.numberOfComponents.length - 1] : 'NA';
          }
          if (this.selectedModelTrainingData.featureImportance) {
            this.selectedModelTrainingData.featureImportance = Object.keys(res.data.featureImportance).map((x) => {
              return {
                key: x,
                value: res.data.featureImportance[x],
                color: +res.data.featureImportance[x] < 0 ? 'warn' : '',
                barVal: Math.abs(res.data.featureImportance[x]),
                displayValue: Math.round(res.data.featureImportance[x] * 1000) / 1000,
                count: 0
              };
            });
          }
          this.setSelectedModelDetails(res.data);
          this.scheduleSoc('5s');
        }
      }, (error) => {
        this.anmdTrResLoading = false;
      });
    }
  }
  getAnomalyDetectionResult(anmdModel) {
    this.anmdDetailsLoading = true;
    const data = { modelId: anmdModel.uid };
    this.anomalyService.getAnomalyDetDetails(data).subscribe((res: any) => {
      this.anmdDetailsLoading = false;
      if (res.status === 'success') {
        this.anomaltDetectedData = res.data;
        this.selectedModelAnmdDATA = res.data;
        this.selectedModelAnmdDATA.speedDisp = this.selectedModelAnmdDATA.speed
          && !isNaN(this.selectedModelAnmdDATA.speed) ? Math.round(this.selectedModelAnmdDATA.speed * 1000) / 1000 : null;
        this.selectedModelAnmdDATA.cpuUsageDisp = this.selectedModelAnmdDATA.cpuUsage
          && !isNaN(this.selectedModelAnmdDATA.cpuUsage) ? Math.round(this.selectedModelAnmdDATA.cpuUsage * 100) : null;
        this.selectedModelAnmdDATA.cpuMemoryUsageDisp = this.selectedModelAnmdDATA.cpuMemoryUsage
          && !isNaN(this.selectedModelAnmdDATA.cpuMemoryUsage) ? Math.round(this.selectedModelAnmdDATA.cpuMemoryUsage * 100) : null;
        this.selectedModelAnmdDATA.gpuUsageDisp = this.selectedModelAnmdDATA.gpuUsage
          && !isNaN(this.selectedModelAnmdDATA.gpuUsage) ? Math.round(this.selectedModelAnmdDATA.gpuUsage * 100) : null;
        this.selectedModelAnmdDATA.gpuMemoryUsageDisp = this.selectedModelAnmdDATA.gpuMemoryUsage
          && !isNaN(this.selectedModelAnmdDATA.gpuMemoryUsage) ? Math.round(this.selectedModelAnmdDATA.gpuMemoryUsage * 100) : null;
        this.setSelectedModelDetails(this.selectedModelAnmdDATA);
        this.scheduleSoc('5s');
      } else {
        this.anomaltDetectedData = undefined;
        this.anmdDetailsLoading = false;
      }
    }, (error) => {
      this.anomaltDetectedData = undefined;
      this.anmdDetailsLoading = false;
    });
  }
  // on search
  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    this.AlltasksFilter.modelName = searchVal;
    this.clearSelection();
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
      // alert("Invalid page number")
    } else {
      this.config.currentPage = inputVal;
      this.clearSelection();
    }
  }

  // onpage change
  changepage(evt) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
    this.clearSelection();
  }

  // set new page size for pagination
  setNewPageSize(pageSize) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.clearSelection();
  }

  toggleicons(x) {
    x.classList.toggle('fa-chevron-circle-right');
  }
  toggleShow() {
    this.isShown = !this.isShown;
  }
  toggleView() {
    this.toggle = !this.toggle;
  }
  switchTab(val) {
    switch (val) {
      case 0:
        this.trTab = true;
        break;
      case 1:
        this.trTab = false;
        break;
    }
  }

  createStopObject(dataObj) {
    const UsageDataObj = Object.assign({}, this.selectedModelAnmdDATA);
    const newObject = {
      accuracy: dataObj.accuracy ? dataObj.accuracy : '',
      dataSetName: dataObj.dataSetName ? dataObj.dataSetName : '',
      modelConfigName: dataObj.modelConfigName ? dataObj.modelConfigName : '',
      modelName: dataObj.modelName ? dataObj.modelName : '',
      modelType: dataObj.modelType ? dataObj.modelType : '',
      scheduleName: dataObj.scheduleName ? dataObj.scheduleName : '',
      uid: dataObj.uid ? dataObj.uid : '',

      modelId: dataObj.uid ? dataObj.uid : '',
      jobStatus: 'COMPLETED',
      jobType: 'EXECUTION',

      lossFunction: UsageDataObj && UsageDataObj.lossFunction ? UsageDataObj.lossFunction : '',
      speed: UsageDataObj && UsageDataObj.speed ? UsageDataObj.speed : '',
      threshold: UsageDataObj && UsageDataObj.threshold ? UsageDataObj.threshold : '',
      timeUsed: UsageDataObj && UsageDataObj.timeUsed ? UsageDataObj.timeUsed : '',
      gpuMemoryUsage: UsageDataObj && UsageDataObj.gpuMemoryUsage ? UsageDataObj.gpuMemoryUsage : '',
      gpuUsage: UsageDataObj && UsageDataObj.gpuUsage ? UsageDataObj.gpuUsage : '',
      cpuMemoryUsage: UsageDataObj && UsageDataObj.cpuMemoryUsage ? UsageDataObj.cpuMemoryUsage : '',
      cpuUsage: UsageDataObj && UsageDataObj.cpuUsage ? UsageDataObj.cpuUsage : '',
      numberOfAbnormalData: UsageDataObj && UsageDataObj.numberOfAbnormalData ? UsageDataObj.numberOfAbnormalData : '',
      numberOfRecordsprocessed: UsageDataObj && UsageDataObj.numberOfRecordsprocessed ? UsageDataObj.numberOfRecordsprocessed : '',
      numberofJobsRunning: UsageDataObj && UsageDataObj.numberofJobsRunning ? UsageDataObj.numberofJobsRunning : '',
      numberofNormalData: UsageDataObj && UsageDataObj.numberofNormalData ? UsageDataObj.numberofNormalData : '',
    };

    return Object.assign({}, newObject);
  }

  stopAnomaly() {
    if (this.selectedModelAnmdDATA && this.selectedModelAnmdDATA.uid) {
      this.global.opendisplayModal('Do you wish to stop Anomaly Detection', 'Confirm', 'Stop Trained Model', true)
        .subscribe(result => {
          if (result === 'save') {
            const data = { trainedModels: this.createStopObject(this.selectedModelAnmdDATA) };
            this.anomalyService.stopAnomalyDetection(data).subscribe((resp: any) => {
              if (resp && resp.status === 'success' && resp.data.deletedCount !== 0) {
                this.notify.showToastrSuccess('Success', ' Anomaly Detection stopped successfully.');
                this.getAnomalyDetectionResult(this.selectedModel);
              } else {
                this.notify.showToastrWarning('Alert', 'Exception occured');
              }

            }, err => {
              this.notify.showToastrError('Alert', 'Server error occured');
            });
          }
        });
    } else {
      this.global.opendisplayModal(' Anomaly Detection details are not available to proceed with the action', 'OK', 'Alert');
    }
  }

  detectAnomaly() {
    if (this.selectedModel && this.selectedModel.uid) {
      const data = {
        dataRange: this.selectedModel.dataRange,
        dataSetName: this.selectedModel.dataSetName,
        jobStatus: 'SCHEDULED',
        jobType: 'EXECUTION',
        modelConfigName: this.selectedModel.modelConfigName,
        modelId: this.selectedModel.uid,
        modelName: this.selectedModel.modelName,
        modelType: this.selectedModel.modelType,
        scheduleName: this.selectedModel.scheduleName,
        threshold: this.selectedModel.threshold,
      };
      this.anomalyService.scheduleDetectAnomaly(data).subscribe((res: any) => {
        if (res.status === 'success') {
          this.anomaltDetectedData = res.data;
          this.scheduleSoc('5s');
          this.disableDetectAnomalyBtn = true;
          this.notify.showToastrSuccess('Success', 'Detect Anomaly');
          this.getAnomalyDetectionResult(this.selectedModel);
          this.updateLiveTableData(this.anomaltDetectedData);
        } else {
          this.anomaltDetectedData = undefined;
          this.selectedModelAnmdDATA = undefined;
          this.notify.showToastrWarning('Failed', 'Detect Anomaly');
        }
      }, (error) => {
        this.anomaltDetectedData = undefined;
        this.selectedModelAnmdDATA = undefined;
        this.notify.showToastrError('Error', 'Detect Anomaly');
      });
    } else {
      this.notify.showToastrWarning('Failed', 'Invalid model');
    }
  }
  scheduleSoc(value) {
    const id = this.appScheduler.getSessionId();
    if (value !== 'off') {
      this.socket = this.appScheduler.connectSocket();
      const that = this;
      this.socket.connect({}, () => {
        this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.ANMD_ANMD_TABLE), message => {
          const payload = JSON.parse(message.body);
          that.updateLiveTableData(payload);
        });
        if (that.anomaltDetectedData && that.anomaltDetectedData.uid) {
          this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.ANMD_ANMD_RESULT,
            that.anomaltDetectedData.uid), message => {
              const payload = JSON.parse(message.body);
              that.updateLiveDetectionStatus(payload);
            });
        }
      });
    } else {
      this.appScheduler.disconnectSocket();
    }
  }
  updateLiveTableData(data) {
    if (data  && data.length && data.length > 0) {
      this.tempAnomalyDetections = data.map(x => {
        if (x.modelName && x.modelName.includes('.')) {
          const modList = x.modelName.split('.');
          x.modelNameDisp = modList[0];
        } else {
          x.modelNameDisp = x.modelName;
        }
        if (x.accuracy && x.accuracy.length && x.accuracy.length > 0) {
          if (x.accuracy[x.accuracy.length - 1] && !isNaN(Number(x.accuracy[x.accuracy.length - 1]))) {
            x.accuracyDisp = Math.round(x.accuracy[x.accuracy.length - 1] * 1000) / 1000;
            if (x.accuracyDisp === 1) {
              x.accuracyDisp = Math.floor(x.accuracy[x.accuracy.length - 1] * 1000) / 1000;
            }
          } else {
            x.accuracyDisp = 'NA';
          }
        }

        return x;
      });
      this.setDrapdownValues();
    }
  }
  updateLiveDetectionStatus(data) {
    if (data && this.selectedModelAnmdDATA.uid === data.uid) {
      this.selectedModelAnmdDATA = data;
      this.selectedModelAnmdDATA.speedDisp = this.selectedModelAnmdDATA.speed
        && !isNaN(this.selectedModelAnmdDATA.speed) ? Math.round(this.selectedModelAnmdDATA.speed * 1000) / 1000 : null;
      this.selectedModelAnmdDATA.cpuUsageDisp = this.selectedModelAnmdDATA.cpuUsage
        && !isNaN(this.selectedModelAnmdDATA.cpuUsage) ? Math.round(this.selectedModelAnmdDATA.cpuUsage * 100) / 100 : null;
      this.selectedModelAnmdDATA.cpuMemoryUsageDisp = this.selectedModelAnmdDATA.cpuMemoryUsage
        && !isNaN(this.selectedModelAnmdDATA.cpuMemoryUsage) ? Math.round(this.selectedModelAnmdDATA.cpuMemoryUsage * 100) / 100 : null;
      this.selectedModelAnmdDATA.gpuUsageDisp = this.selectedModelAnmdDATA.gpuUsage
        && !isNaN(this.selectedModelAnmdDATA.gpuUsage) ? Math.round(this.selectedModelAnmdDATA.gpuUsage * 100) / 100 : null;
      this.selectedModelAnmdDATA.gpuMemoryUsageDisp = this.selectedModelAnmdDATA.gpuMemoryUsage
        && !isNaN(this.selectedModelAnmdDATA.gpuMemoryUsage) ? Math.round(this.selectedModelAnmdDATA.gpuMemoryUsage * 100) / 100 : null;
      this.setSelectedModelDetails(this.selectedModelAnmdDATA);
    }
  }
  ngOnDestroy() {
    this.anomalyService.AnomalyDetection = false;
    this.appScheduler.disconnectSocket();
  }
  setUrl() {
    const eUrl = this.elUrl.replace(/_vaxModelNamevax_/g, this.selectedModel.modelName);
    this.selectedModel.modelUrl = this.sanitizer.bypassSecurityTrustResourceUrl(eUrl);
  }
  sort(key) {
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
    this.clearSelection();
  }
  clearSelection() {
    this.selectedModel = undefined;
    this.selectedModelAnmdDATA = undefined;
    this.selectedModelTrainingData = [];
    this.scheduleSoc('5s');
  }
}
