import { Component, OnInit, OnDestroy, ViewChild, AfterViewChecked } from '@angular/core';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { GlobalService } from 'src/app/services/global.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AnomalyService } from '../../services/anomaly.service';
import { NotificationService } from 'src/app/services/notification.service';
import * as moment from 'moment';
import { AppSchedulerService } from 'src/app/services/app-scheduler.service';
import { SUBSCRIPTIONS } from 'src/app/constants/app.constants';
import { ModelConfigViewComponent } from '../../dialogs/model-config-view/model-config-view.component';
@Component({
  selector: 'app-anomaly-view',
  templateUrl: './anomaly-view.component.html',
  styleUrls: ['./anomaly-view.component.css']
})
export class AnomalyViewComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('clickMenuTrigger', { static: false }) trigger: MatMenuTrigger;
  tableData;
  Loader = true;
  headers: any;
  showFirst: any;
  key = 'name';
  reverse = false;
  keyP = 'name';
  reverseP = false;
  isShowDiv = false;
  scheduleRes;
  p = 1;
  isTableLoading = false;
  private pageSize = 10;
  closeforecastEdit: any;
  forecastData: any[];
  tempAnomalyDetections: any[] = [];
  tempforecast: any[];
  ModelConfigArr: any = [];
  modalEditRef: BsModalRef;
  foretableLength: any = 0;
  forecastDisabled = true;
  editforecastObject: any;
  editforecastName: any;
  selectedAnomaly: any = null;
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
  getCallData: any;
  forecast: any;
  sample: any;
  input: any;
  startScDate;
  endScDate;
  edittemplate: any;
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  isShown = true;
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage: number = this.defauultItempg;
  inputCurrentpage: number = this.defaultCurrentPage;
  itemPerPageMinTable: number = this.defauultItempg;
  inputCurrentpageMinTable: number = this.defaultCurrentPage;
  searchFilter = '';
  searchFilterMain = '';
  defaultJobType = 'FORECAST';
  dataSetList = [];
  anmdStatusList;
  modelTypeList;
  dataSetSelected = '';
  anmdStatusSelected;
  modelTypeSelected = '';
  featureCount = 38;
  selectedInterval = 'off';
  selectionDataSet = [{ id: '1', name: 'selction 1' }, { id: '2', name: 'selction 2' }, { id: '2', name: 'selction 2' }];
  pageArr = [25, 50, 100];
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  configMinTable = {
    id: 'paginate2',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  disableSelectButton = false;
  masterDataLoader = true;
  dataSetDetailsLoading = false;
  selectedModel: any = {};
  trTab = true;
  anomalyCount = '';
  temptabledata = [];
  timeFilterDetails: any = {
    fromDate: '',
    fromTimeHr: '',
    fromTimeMin: '',
    toDate: '',
    toTimeHr: '',
    toTimeMin: '',
    filterFeature: '',
    minToDate: '',
    enableFilter: false
  };
  timeFilterValue = '';
  enableFilterFeature = false;
  correlationFromTimePeriod = '';
  correlationToTimePeriod = '';


  isLoading = false;
  socket;
  constructor(
    private notify: NotificationService,
    private appScheduler: AppSchedulerService,
    public dialog: MatDialog,
    public global: GlobalService,
    public anomalyService: AnomalyService) {
    const latestDate = this.getUtcDateTime(new Date());
    this.timeFilterDetails.fromDate = latestDate;
    this.timeFilterDetails.toDate = latestDate;
  }

  ngOnInit() {
    this.anomalyService.AnomalyView = true;
    this.getDataSetList();
  }

  ngAfterViewChecked() {
    if (this.isTableLoading || this.dataSetDetailsLoading || this.isLoading || this.masterDataLoader) {
      this.anomalyService.disableheader = true;
    } else {
      this.anomalyService.disableheader = false;
    }
  }

  convertDateToUTC(localDate?) {
    localDate = localDate ? localDate : new Date();
    return new Date(localDate.getTime() + (localDate.getTimezoneOffset() * 60000));
  }
  valdateTime(hrs, min) {
    if (hrs < 0 || hrs > 24) {
      return true;
    } else if (min < 0 || min > 60) {
      return true;
    } else {
      const totalTime = +(hrs + '' + min);
      return totalTime >= 0 && totalTime <= 2400 ? false : true;
    }
  }
  openTimeEditMenu() {
    this.timeFilterDetails.enableFilter = this.enableFilterFeature;
    this.timeFilterDetails.filterFeature = this.timeFilterValue;
    const currentDate = this.convertDateToUTC();
    const prevCurr = this.convertDateToUTC();
    prevCurr.setDate(prevCurr.getDate() - 1);
    // tslint:disable-next-line:max-line-length
    const fromDateObj = this.correlationFromTimePeriod ? this.getTimeFiterVal(this.correlationFromTimePeriod) : this.getTimeFiterVal(prevCurr);
    const toDateObj = this.correlationToTimePeriod ? this.getTimeFiterVal(this.correlationToTimePeriod) : this.getTimeFiterVal(currentDate);
    this.timeFilterDetails.fromDate = fromDateObj ? fromDateObj.dateVal : '';
    this.timeFilterDetails.fromTimeHr = fromDateObj ? fromDateObj.hrs : '';
    this.timeFilterDetails.fromTimeMin = fromDateObj ? fromDateObj.min : '';
    this.timeFilterDetails.toDate = toDateObj ? toDateObj.dateVal : '';
    this.timeFilterDetails.toTimeHr = toDateObj ? toDateObj.hrs : '';
    this.timeFilterDetails.toTimeMin = toDateObj ? toDateObj.min : '';
    this.timeFilterDetails.minToDate = new Date(this.timeFilterDetails.fromDate);
  }
  getTimeFiterVal(StrDate) {
    const dateObj = new Date(StrDate);
    let hrsVal: any = dateObj.getHours().toString();
    let minVal: any = dateObj.getMinutes().toString();
    hrsVal = hrsVal.length === 1 ? ('0' + hrsVal) : hrsVal;
    minVal = minVal.length === 1 ? ('0' + minVal) : minVal;
    return { dateVal: dateObj, hrs: hrsVal, min: minVal };
  }
  OnTimeFilterCheckBox(value) {
    if (value === false) {
      this.timeFilterDetails.filterFeature = '';
    }
  }
  onFromDateChange() {
    // tslint:disable-next-line:max-line-length
    if (this.timeFilterDetails.toDate && this.timeFilterDetails.fromDate && new Date(this.timeFilterDetails.toDate) < new Date(this.timeFilterDetails.fromDate)) {
      this.timeFilterDetails.toDate = '';
    }
    this.timeFilterDetails.minToDate = this.timeFilterDetails.fromDate ? new Date(this.timeFilterDetails.fromDate) : '';
  }
  setDateDetailsToRunCorrelation() {
    const fromDateInFormat = new Date(this.timeFilterDetails.fromDate);
    const toDateInFormat = new Date(this.timeFilterDetails.toDate);
    // tslint:disable-next-line:max-line-length
    const fromTimeDateCreate = this.getDateString(fromDateInFormat) + ' ' + this.getHrsMin(this.timeFilterDetails.fromTimeHr, this.timeFilterDetails.fromTimeMin);
    // tslint:disable-next-line:max-line-length
    const toTimeDateCreate = this.getDateString(toDateInFormat) + ' ' + this.getHrsMin(this.timeFilterDetails.toTimeHr, this.timeFilterDetails.toTimeMin);
    this.enableFilterFeature = this.timeFilterDetails.enableFilter;
    if (this.valdateTime(this.timeFilterDetails.fromTimeHr, this.timeFilterDetails.fromTimeMin) === true) {
      this.global.opendisplayModal('From Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
    } else if (this.valdateTime(this.timeFilterDetails.toTimeHr, this.timeFilterDetails.toTimeMin) === true) {
      this.global.opendisplayModal('To Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
    } else {
      this.correlationFromTimePeriod = fromTimeDateCreate;
      this.correlationToTimePeriod = toTimeDateCreate;
    }
    this.timeFilterValue = 'true';
    this.someMethod();
  }
  someMethod() {
    if (this.trigger) {
      this.trigger.closeMenu();
    }
  }
  getDateString(dateObj) {
    let dateVal: any = dateObj.getDate();
    const dateMonth = dateObj.toLocaleString('default', { month: 'short' });
    const dateYear = dateObj.getFullYear();
    dateVal = dateVal < 10 ? ('0' + dateVal) : dateVal;
    return (dateMonth + '-' + dateVal + '-' + dateYear);
  }
  getHrsMin(hrs, min) {
    const hrsVal = hrs.length === 1 ? ('0' + hrs) : hrs;
    const MinVal = min.length === 1 ? ('0' + min) : min;
    return (hrsVal + ':' + MinVal);
  }
  getDataSetList() {
    this.masterDataLoader = true;
    const JobType = { jobType: 'ANOMALY DETECTION' };
    this.anomalyService.getAnomalyDataSets(JobType).subscribe((res: any) => {
      this.masterDataLoader = false;
      this.openTimeEditMenu();
      this.setDateDetailsToRunCorrelation();
      if (res && res.status === 'success') {
        this.dataSetList = res.data && res.data.data ? res.data.data : [];
        this.dataSetSelected = this.dataSetList[0];
        this.loadTableData(true);
      } else {
        this.notify.showToastrWarning('Alert', 'Exception occured');
        this.masterDataLoader = false;
      }

    }, err => {
      this.notify.showToastrError('Alert', 'Server error occured');
      this.masterDataLoader = false;
    });
  }
  toISO(dt) {
    return dt ? moment(dt).format('YYYY-MM-DDTHH:mm:ss') + 'Z' : 'None';
  }
  loadTableData(enableLoader?) {
    if (enableLoader) {
      this.isLoading = true;
    }
    this.isTableLoading = true;
    const data = {
      dataSetName: this.dataSetSelected,
      fromTime: this.toISO(this.correlationFromTimePeriod),
      toTime: this.toISO(this.correlationToTimePeriod)
    };
    this.anomalyService.getAnomalyModelsTableData(data).subscribe((res: any) => {
      this.isLoading = false;
      this.isTableLoading = false;
      if (res.status === 'success') {
        this.anomalyCount = res.data.length;
        this.tempAnomalyDetections = res.data.map((x) => {
          x.modelName = x.kafka_consumer.modelName;
          if (x.modelName && x.modelName.includes('.')) {
            const modList = x.modelName.split('.');
            x.modelNameDisp = modList[0];
          } else {
            x.modelNameDisp = x.modelName;
          }
          x.dataSet = x['@timestamp'];
          x.modelType = x.kafka_consumer.modelType;
          x.dataSetName = x.kafka_consumer.dataSetName;
          x.modelConfigName = x.kafka_consumer.modelConfigName;

          if (x.kafka_consumer.loss && !isNaN(Number(x.kafka_consumer.loss))) {
            x.loss = Math.round(x.kafka_consumer.loss * 1000) / 1000;
            if (x.loss === 1) {
              x.loss = Math.floor(x.kafka_consumer.loss * 1000) / 1000;
            }
          } else {
            x.loss = 'NA';
          }
          return x;
        });
        if (this.tempAnomalyDetections && this.tempAnomalyDetections.length && this.tempAnomalyDetections.length > 0) {
          this.displayModel(this.tempAnomalyDetections[0]);
          this.setDrapdownValues();
        }
      }
    }, (error) => {
      this.isTableLoading = false;
      this.isLoading = false;
    });
  }
  setDrapdownValues() {

    this.anmdStatusList = [{
      key: 0,
      value: 'All'
    }];
    this.anmdStatusSelected = this.anmdStatusList[0].key;
    const anmdStatusListTemp = this.tempAnomalyDetections.filter((thing, i, arr) => {
      return arr.indexOf(arr.find(t => t.status === thing.status)) === i;
    }).map((elem, i) => {
      return {
        key: i + 1,
        value: elem.status
      };
    });
    this.anmdStatusList = [...this.anmdStatusList, ...anmdStatusListTemp];
    this.modelTypeList  = this.tempAnomalyDetections.filter((thing, i, arr) => {
      return arr.indexOf(arr.find(t => t.modelType === thing.modelType)) === i;
    }).map((elem, i) => {
      return  elem.modelType;
    });
    
  }
  checkAlls(ev) {
    this.tempAnomalyDetections.forEach(x => x.checkboxdata = ev.target.checked);
  }

  isAllChecked() {
    return this.tempAnomalyDetections.every(_ => _.checkboxdata);
  }
  checkifObjectExist() {
    return this.selectedModel && Object.keys(this.selectedModel).length > 0 ? true : false;

  }
  displayModel(anmdModel) {
    if (!this.disableSelectButton && (!this.checkifObjectExist()  || (this.selectedModel &&
      this.selectedModel.reasonStatus
      && this.selectedModel.reasonStatus.toLowerCase() === 'completed'))) {
      this.appScheduler.disconnectSocket();
      const data = anmdModel;
      this.selectedModel = data;
      this.selectedModel.predictionReason = [];
      this.selectedModel.reasonStatus = 'Analysing';
      this.scheduleAnomalies();
    }
  }
  // on search
  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    this.clearSelection();
  }
  onsearchChangeMin(searchVal) {
    this.inputCurrentpageMinTable = this.defaultCurrentPage;
    this.configMinTable.currentPage = this.defaultCurrentPage;
  }
  // change page on input
  changepageinp(inputVal, lastpage, table) {
    if (table) {
      if (inputVal < 1 || inputVal > lastpage) {
        this.inputCurrentpage = this.config.currentPage;
        // alert("Invalid page number")
      } else {
        this.config.currentPage = inputVal;
        this.clearSelection();
      }
    } else {
      if (inputVal < 1 || inputVal > lastpage) {
        this.inputCurrentpageMinTable = this.configMinTable.currentPage;
        // alert("Invalid page number")
      } else {
        this.configMinTable.currentPage = inputVal;
      }
    }
  }

  // onpage change
  changepage(evt, table) {
    if (table) {
      this.config.currentPage = evt;
      this.inputCurrentpage = evt;
      this.clearSelection();
    } else {
      this.configMinTable.currentPage = evt;
      this.inputCurrentpageMinTable = evt;
    }

  }

  // set new page size for pagination
  setNewPageSize(pageSize, table) {
    if (table) {
      this.config.itemsPerPage = pageSize;
      this.config.currentPage = this.defaultCurrentPage;
      this.inputCurrentpage = this.defaultCurrentPage;
      this.clearSelection();
    } else {
      this.configMinTable.itemsPerPage = pageSize;
      this.configMinTable.currentPage = this.defaultCurrentPage;
      this.inputCurrentpageMinTable = this.defaultCurrentPage;
    }

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
  getConfigDetailsOnRow(selectedObj, i) {
    this.selectedAnomaly = Object.assign({}, selectedObj);
    // this.getselectedDetails(selectedObj);
  }

  getUtcDateTime(dateObject) {
    const UTCdate = dateObject.getUTCDate();
    const UTCFullYear = dateObject.getUTCFullYear();
    const UTCMonth = dateObject.getUTCMonth() + 1;
    const UTCHours = dateObject.getUTCHours();
    const UTCMinutes = dateObject.getUTCMinutes();
    const UTCSeconds = dateObject.getUTCSeconds();
    let changedMonth;
    let changedDay;
    let changedHours;
    let changedMinutes;
    let changedSeconds;
    if (UTCMinutes < 10) {
      changedMinutes = '0' + UTCMinutes;
    } else {
      changedMinutes = UTCMinutes;
    }
    if (UTCSeconds < 10) {
      changedSeconds = '0' + UTCSeconds;
    } else {
      changedSeconds = UTCSeconds;
    }

    if (UTCMonth < 10) {
      changedMonth = '0' + UTCMonth;
    } else {
      changedMonth = UTCMonth;
    }

    if (UTCdate < 10) {
      changedDay = '0' + UTCdate;
    } else {
      changedDay = UTCdate;
    }

    if (UTCHours < 10) {
      changedHours = '0' + UTCHours;
    } else {
      changedHours = UTCHours;
    }

    const clock = UTCFullYear + '-' + changedMonth +
      '-' + changedDay;

    return clock;
  }
  ngOnDestroy() {
    this.anomalyService.AnomalyView = false;
    this.appScheduler.disconnectSocket();
  }
  valuechange(event) {
  }
  scheduleAnomalies() {
    if (this.selectedModel) {
      const modelTimes = this.selectedModel.modelName ? this.selectedModel.modelName.split('_') : [];
      const data = {
        anomalyId: this.selectedModel.dataSet ? this.selectedModel.dataSet : '',
        groupName: '',
        dataSetName: this.selectedModel.dataSetName ? this.selectedModel.dataSetName : '',
        jobStatus: 'SCHEDULED',
        jobType: 'ANOMALYPROFILING',
        modelConfigName: this.selectedModel.modelConfigName ? this.selectedModel.modelConfigName : '',
        modelName: this.selectedModel.modelName ? this.selectedModel.modelName : '',
        modelType: this.selectedModel.modelType ? this.selectedModel.modelType : '',
        label: '',
        timeFilterFeature: '',
        fromTime: this.toISO(this.correlationFromTimePeriod),
        toTime: this.toISO(this.correlationToTimePeriod),
        modelFromTime: modelTimes[modelTimes.length - 3],
        modelToTime: modelTimes[modelTimes.length - 2],
        indexName: 'anomaly_profiler*'
      };
      this.anomalyService.scheduleAnomalyProfiler(data).subscribe((res: any) => {
        if (res.status === 'success') {
          this.scheduleRes = res.data;
          if (res.data.response && res.data.predictionReason && res.data.predictionReason.length) {
            this.selectedModel.reasonStatus = 'Completed';
            res.data.predictionReason = JSON.parse(res.data.predictionReason);
            if (res.data.predictionReason && res.data.predictionReason.length && res.data.predictionReason.length > 0) {
              if (res.data.predictionReason[0].predictionReason) {
                const listData = res.data.predictionReason[0].predictionReason.split(',');
                if (listData && listData.length && listData.length > 0) {
                  this.selectedModel.predictionReason = listData.map(x => {
                    const elements = x.split(' ');
                    return {
                      key: elements[0],
                      value: x.replace(elements[0], '')
                    };
                  });
                }
              }
            }
          } else {
            this.scheduleSoc('5s');
          }
        } else {

          this.notify.showToastrWarning('Failed', 'To get Anomaly Reason');
        }
      }, (error) => {

        this.notify.showToastrError('Error', 'To get Anomaly Reason');
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
        if (this.scheduleRes && this.scheduleRes.uid) {
          this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.ANMD_ANM_PROFILING,
            this.scheduleRes.uid, this.selectedModel.modelType), message => {
              const payload = JSON.parse(message.body);
              if (payload && payload.length && payload.length > 0) {
                if (payload[0].hasOwnProperty('status')) {
                  that.selectedModel.reasonStatus = payload[0].status;
                  if (payload[0].status.toLowerCase() === 'completed') {
                    that.getAnomalyProfilerData();
                  }
                } else if (payload[0].hasOwnProperty('message')) {
                  // this.profilerResult = payload;
                  this.notify.showToastrSuccess('Profiler', payload[0].message);
                }
              }
            });
          // this.socket.onConnect(x => {
          //   that.disableSelectButton = true;
          // });
          // this.socket.onDisconnect(x => {
          //   that.disableSelectButton = false;
          // });
        }
      });
    } else {
      this.appScheduler.disconnectSocket();
    }
  }
  getAnomalyProfilerData() {
    this.appScheduler.disconnectSocket();
    const data = {
      anomalyId: this.selectedModel.dataSet ? this.selectedModel.dataSet : '',
      modelType: this.selectedModel.modelType ? this.selectedModel.modelType : '',
    };
    // this.dataSetDetailsLoading = true;
    this.anomalyService.getAnomalyProfiler(data).subscribe((res: any) => {
      this.dataSetDetailsLoading = false;
      if (res.status === 'success') {
        if (res.data && res.data.length && res.data.length > 0
          && res.data[0].anomalyId && this.selectedModel && this.selectedModel.dataSet === res.data[0].anomalyId) {
          if (res.data[0].predictionReason) {
            const listData = res.data[0].predictionReason.split(',');
            if (listData && listData.length && listData.length > 0) {
              this.selectedModel.predictionReason = listData.map(x => {
                const elements = x.split(' ');
                return {
                  key: elements[0],
                  value: x.replace(elements[0], '')
                };
              });
            }
          }
        }
      } else {

        this.notify.showToastrWarning('Failed', ' Anomaly Profiler result');
        this.dataSetDetailsLoading = false;
      }
    }, (error) => {
      this.dataSetDetailsLoading = false;
      this.notify.showToastrError('Error', ' Anomaly Profiler result');
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
  sort(key) {
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
    this.clearSelection();
  }
  sortMin(key) {
    if (key === this.keyP) {
      this.reverseP = !this.reverseP;
    } else {
      this.keyP = key;
      this.reverseP = true;
    }
  }
  clearSelection() {
    this.selectedModel = {};
    this.appScheduler.disconnectSocket();
  }
}
