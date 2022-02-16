import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ForecastService } from '../../services/forecast.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { GlobalService } from 'src/app/services/global.service';
import { StopForecastProcessComponent } from '../../dialogs/stop-forecast-process/stop-forecast-process.component';
import { map } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { AppSchedulerService } from 'src/app/services/app-scheduler.service';
import { PATHS, SUBSCRIPTIONS } from 'src/app/constants/app.constants';



// New Dialoge Componet Starts Here
@Component({
  selector: 'app-edit-forecast',
  templateUrl: './Editforecastprocessingmodal.html',
  styleUrls: ['./forecast-processing.component.css']
})
export class EditForecastprocessingComponent implements OnInit {
  edictRadio: any;
  saveforecastAPI: any;
  closeforecastEdit: any;
  getCallData: any;
  sample: any;
  input: any;
  Loader = true;
  headers: any;
  forecastData: any[];
  tempforecast: any[];
  tableData: any = [];
  ModelConfigArr: any = [];
  modalEditRef: BsModalRef;
  foretableLength: any = 0;
  forecastDisabled = true;
  editforecastObject: any;
  editforecastName: any;
  threadId: any;
  editSampletime: any;
  mintime: any;
  maxtime: any;
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
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  isLoading = true;

  defaultCurrentPage = 1;
  defauultItempg = 10;
  defaultModelType = 'FORECAST';
  selectedModelObject: any = {};
  tableDetailsErrorMsg = '';
  constructor(
    public dialog: MatDialog,
    public global: GlobalService,
    private forecastService: ForecastService,
    private notify: NotificationService,
    public dialogRef: MatDialogRef<EditForecastprocessingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    // this.editforecastObject = this.data.forecastEdit;
    // this.editforecastName = this.editforecastObject.pmId;
    // this.threadId = this.editforecastObject.threadId;
    // this.editSampletime = this.editforecastObject.sampleTime;
    // let datarangesplit = this.editforecastObject.defaultDataRange;
    // if (datarangesplit == null || datarangesplit === undefined) {
    //   datarangesplit = '';
    // }
    // const convertdatarange = datarangesplit.split(',');
    // this.mintime = convertdatarange[0];
    // this.maxtime = convertdatarange[1];
    // this.editid = this.editforecastObject.id;
    // this.editne = this.editforecastObject.ne;
    // this.pmType = this.editforecastObject.pmType;
    // this.podNumber = this.editforecastObject.podNumber;
    // this.jobStatus = this.editforecastObject.jobStatus;
    // const frwdprdata = this.editforecastObject.timeForForwardPrediction;
    // this.editForecastparam = this.editforecastObject.modelParameter;
    // this.frwrdPredict = frwdprdata.toString().replace(/\D/g, '');
    // const replaceString = frwdprdata.toString().replace(/[^a-z]/gi, '');
    // this.editSeconds = true;
    // if (replaceString === 'h') {
    //   this.editHours = true;
    //   this.editDays = false;
    //   this.editSeconds = false;
    //   this.editMinutes = false;
    // } else if (replaceString === 'm') {
    //   this.editMinutes = true;
    //   this.editHours = false;
    //   this.editDays = false;
    //   this.editSeconds = false;
    // } else if (replaceString === 's') {
    //   this.editSeconds = true;
    //   this.editMinutes = false;
    //   this.editHours = false;
    //   this.editDays = false;
    // } else if (replaceString === 'D') {
    //   this.editDays = true;
    //   this.editSeconds = false;
    //   this.editMinutes = false;
    //   this.editHours = false;
    // }

    // this.checkmodelparam();
    this.getModelConfigData(this.data.modelConfigName);
  }
  checkmodelparam() {
    this.editForecastparam = ['Modelparam', 'Param2'];
    // this.getModelConfig().subscribe(data => {
    //   if(data.status != "fail"){
    // this.ModelConfigArr = [];
    // this.ModelConfigArr.push(...data.data);
    this.ModelConfigArr.push(this.editForecastparam);
  }
  //   });
  // }
  returnvalue() {
    this.dialogRef.close({});
  }
  getModelConfigData(modelConfigName) {
    this.isLoading = true;
    if (modelConfigName) {
      this.isLoading = true;
      const data = { jobType: this.defaultModelType, modelConfig: modelConfigName };
      this.forecastService.getModelConfigDetails(data).subscribe((res: any) => {
        if (res && res.status === 'success' && res.data && Object.keys(res.data).length > 0) {
          res.data.L1 = res.data.l1L2.split(',')[0];
          res.data.L2 = res.data.l1L2.split(',')[1];
          this.selectedModelObject = res.data;
          this.tableDetailsErrorMsg = '';
          this.isLoading = false;
        }
      }, err => {
        this.isLoading = false;
        this.tableDetailsErrorMsg = 'Failed in reaching to server';
        this.notify.showToastrError('Alert', 'Server error occured');
        this.returnvalue();
      });
    } else {
      this.notify.showToastrWarning('Warning', 'Invalid model');
      this.returnvalue();
    }
  }

}




@Component({
  selector: 'app-forecast-processing',
  templateUrl: './forecast-processing.component.html',
  styleUrls: ['./forecast-processing.component.css']
})
export class ForecastProcessingComponent implements OnInit, OnDestroy {
  // selectedDataId = "ALL";
  refreshDataId = 'off';
  Loader = true;
  masterData = [];
  headers: any;
  showFirst: any;
  closeforecastEdit: any;
  forecastData: any[] = [];
  tempforecastprocess: any[] = [];
  forecastProcLiveData: any[] = [];
  tempforecast: any[];
  tableData: any = [];
  ModelConfigArr: any = [];
  modalEditRef: BsModalRef;
  foretableLength: any = 0;
  forecastDisabled = true;
  editforecastObject: any;
  tempSlectedProcess: any = {};
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
  getCallData: any;
  forecast: any;
  sample: any;
  input: any;
  edittemplate: any;
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  isShown = true;
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage: number = this.defauultItempg;
  inputCurrentpage: number = this.defaultCurrentPage;
  searchFilter = '';
  selectedDataId = '';
  selectionDataSet: any = [];
  // selectionDataSet = ["data 1","data 2","data 3"];
  refreshDataset = [
    '5s',
    '10s',
    '15s',
    '30s',
    '1m',
    '5m',
    '10m',
    '15m',
    '30m',
    '1h'
  ];
  tableLiveSub;
  detailsLiveSub;
  pageArr = [25, 50, 100];
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  dataSetDetailsLoading = false;
  grafanaUrl = '';
  grfnUrl = '';
  selectedProcess: any = {};
  selectedModel: any = {};
  key = 'name';
  reverse = false;
  isLoading = false;
  p = 1;
  orderId = 1;
  private pageSize = 10;
  socket;
  // tempForecastdetails = {
  //   status: 'success',
  //   data: {
  //     cpuUsages: 70,
  //     dataId: '1MJF901@1-20-17@Spanloss@PM_NEAR_END_TX',
  //     dataRange: 160,
  //     dataSetName: 'ABCD',
  //     gpuMemoryUsages: 40,
  //     gpuUsages: 60,
  //     lossfunction: 'Universal',
  //     memoryUsages: 90,
  //     modelConfigName: 'Testing',
  //     numberOfForwardSteps: 5,
  //     numberOfJobRunning: 5,
  //     numberofRecordesProcessed: 20,
  //     sampleTime: 5,
  //     speed: 235,
  //     timeOfRunning: 5,
  //     timeseriesType: 'Mean Absolute Error'
  //   }
  // };
  constructor(
    public forecastService: ForecastService,
    private router: Router,
    public sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private notify: NotificationService,
    private websocket: WebsocketService,
    private appScheduler: AppSchedulerService,
    public global: GlobalService) { }

  ngOnInit() {
    this.selectedDataId = '';
    this.getdatatableAPI(true);
    // this.getDatasetlist();
    this.forecastService.ForeCastProcessing = true;
  }
  loadData() {
    const model = this.masterData.find(elem => elem.dataSetName === this.selectedDataId);
    this.displayModel(model, true);
    this.searchFilter = '';
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
  }

  getDatasetlist() {
    const JobType = { jobType: 'FORECAST' };
    this.forecastService.datasetname(JobType).subscribe((res: any) => {
      if (res.status === 'success') {
        this.selectionDataSet = res.data && res.data.data && res.data.data.length > 0 ? [...res.data.data] : [];
      } else {
        this.selectionDataSet = [];
      }
    }, err => {
      this.selectionDataSet = [];
      this.notify.showToastrError('Alert', 'Server error occured');
    });
  }

  ngOnDestroy() {
    this.forecastService.ForeCastProcessing = false;
    this.appScheduler.deleteScSocket();
    this.appScheduler.disconnectSocket();
  }

  /*************************************Sumit Code Starts********* */
  // navigate to compare page
  navigateToCompare() {

    const selectedProcess = this.tempforecastprocess.filter(it => it.checkboxdata === true);
    if (selectedProcess.length > 0) {
      this.forecastService.CompareProcess = [...selectedProcess];
      this.forecastService.dataSetId = this.selectedDataId;
      this.router.navigate(['/forecast/forecastprocess/forecastcompare']);
    } else {
      this.global.opendisplayModal('At least one processing data should be selected for compare', 'OK', 'Alert');
    }
  }

  // disable or enable compare button
  atLeastOneChecked() {
    const selected = this.tempforecastprocess.filter(it => it.checkboxdata === true);
    return (selected.length > 1);
  }
  //  display selected process data
  onSelectProcess(selectedData) {
    const gfnUrl = this.grfnUrl.replace('_vax_var-PM_name_vax_', selectedData.dataId);
    this.selectedProcess =
      Object.assign({
        ...selectedData,
        // tslint:disable-next-line:max-line-length
        Url: this.sanitizer.bypassSecurityTrustResourceUrl(gfnUrl),
      });
  }
  refreshData() {
    const currentRoute = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentRoute]); // navigate to same route
    });
    // this.selectedDataId = '';
    // this.getdatatableAPI(false);
  }
  displayModel(model, enableLoader) {
    if (model.dataId !== this.selectedModel.dataId) {
      this.selectedModel = model;
      // && model.jobStatus.toLowerCase() === 'active'
      if (model && model.jobStatus) {
        if (enableLoader) {
          this.dataSetDetailsLoading = true;
        }
        const data = { dataSetName: model.dataSetName, dataId: model.dataId };
        this.forecastService.forecastProcessingModelDetails(data).subscribe((res: any) => {
          this.dataSetDetailsLoading = false;
          if (res.status === 'success') {
            res.data.lossValue = res.data.lossValue ? Math.round(res.data.lossValue * 10000) / 10000 : null;
            const timeofruns = res.data.timeOfRunning ? res.data.timeOfRunning.split(':') : null;
            if (timeofruns && timeofruns.length > 2) {
              timeofruns[2] = Math.round(timeofruns[2] * 1000) / 1000;
              res.data.timeOfRunning = timeofruns[0] + ':' + timeofruns[1] + ':' + timeofruns[2];
            }
            const speedlist = res.data.speed ? res.data.speed.split('records') : null;
            if (speedlist && speedlist.length > 1) {
              speedlist[0] = Math.round(speedlist[0] * 10000) / 10000;
              res.data.speed = speedlist[0] + 'records' + speedlist[1];
            }
            const dataRanges = res.data.defaultDataRange ? res.data.defaultDataRange.split(',') : null;
            if (dataRanges && dataRanges.length > 1) {
              res.data.minDataRange = dataRanges[0];
              res.data.maxDataRange = dataRanges[1];
            }
            this.orderId = res.orderid;
            this.grafanaUrl = res.grafanaUrl;
            this.grfnUrl = res.grfnUrl;
            this.tempSlectedProcess = res.data;
            this.onSelectProcess(this.tempSlectedProcess);
            if (this.refreshDataId !== 'off') {
            }
            this.scheduleSocForProc('5s');
          } else {
            this.selectedModel = {};
            this.selectedProcess = {};
            this.tempSlectedProcess = {};
            this.notify.showToastrWarning('Warning', 'Details are not available!');
            this.dataSetDetailsLoading = false;
          }
        }, (error) => {
          // if (this.tempForecastdetails.status === 'success') {
          //   this.tempSlectedProcess = this.tempForecastdetails.data;
          //   this.onSelectProcess(this.tempSlectedProcess);
          //  }
          this.selectedModel = {};
          this.selectedProcess = {};
          this.tempSlectedProcess = {};
          this.dataSetDetailsLoading = false;
        });
      }
    }
  }

  // check if any process is selected
  checkifObjectExist(checkObject) {
    return checkObject && Object.keys(checkObject).length > 0 ? true : false;
  }
  scheduleSoc(value) {
    this.appScheduler.invalidateSession();
    const id = this.appScheduler.getSessionId();
    if ((value === 'off' && id) || value !== 'off') {
      this.appScheduler.scheduleSocket(PATHS.FR_PROCESSING, value, 'forecastSelectionProcesingTable', 'FORECAST', 'EXECUTION')
        .subscribe((res: any) => {
          if (res.status === 'success') {
            if (value === 'off') {
              this.appScheduler.deleteSession();
              this.scheduleSocForProc('5s');
              // this.notify.showToastrInfo('APP-SCHEDULER', 'Deleted');
            } else {
              if (res && res.data && res.data.schedule) {
                if (res.data.schedule && res.data.schedule.id) {
                  this.appScheduler.setSessionId(res.data.schedule.id);
                  this.socket = this.appScheduler.connectSocket();
                  const that = this;
                  this.socket.connect({}, () => {
                    that.tableLiveSub = this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.FR_PROC_TABLE), message => {
                      const payload = JSON.parse(message.body);
                      that.updateTableData(payload);
                    });
                    if (this.selectedProcess && this.selectedProcess.uid) {
                      that.detailsLiveSub = this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.FR_PROC_TABLE_VIEW_DETAILS,
                        this.selectedProcess.uid), message => {
                          const payload = JSON.parse(message.body);
                          that.updateForecastProcDetails(payload);
                        });
                    }
                  });
                }
              }
              // this.notify.showToastrInfo('Socket', 'Scheduled');
            }
          } else {
            if (value === 'off') {
              // this.notify.showToastrWarning('APP-SCHEDULER', 'Deleted has issue');
              this.appScheduler.deleteSession();
            } else {
              if (id) {
                this.appScheduler.deleteScSocket();
                this.scheduleSocForProc('5s');
                this.notify.showToastrWarning('Socket', 'has issue: Failed to refresh');
              } else {
                this.notify.showToastrWarning('Socket', 'has issue: Failed to refresh');
              }
            }
          }
        }, (error) => {
          this.notify.showToastrError('Socket', 'Failed');
        });
    }
  }
  scheduleSocForProc(value) {
    if (value !== 'off') {
      this.socket = this.appScheduler.connectSocket();
      const that = this;
      this.socket.connect({}, () => {
        if (this.selectedProcess && this.selectedProcess.uid) {
          that.detailsLiveSub = this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.FR_PROC_TABLE_VIEW_DETAILS,
            this.selectedProcess.uid), message => {
              const payload = JSON.parse(message.body);
              that.updateForecastProcDetails(payload);
            });
        }
        if (this.refreshDataId !== 'off') {
          that.tableLiveSub = this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.FR_PROC_TABLE), message => {
            const payload = JSON.parse(message.body);
            that.updateTableData(payload);
          });
        }
      });
    } else {
      this.appScheduler.disconnectSocket();
    }
  }
  updateForecastProcDetails(liveData) {
    if (liveData && this.tempSlectedProcess.uid === liveData.uid) {
      liveData.lossValue = liveData.lossValue ? Math.round(liveData.lossValue * 10000) / 10000 : null;
      const timeofruns = liveData.timeOfRunning ? liveData.timeOfRunning.split(':') : null;
      if (timeofruns && timeofruns.length > 2) {
        timeofruns[2] = Math.round(timeofruns[2] * 1000) / 1000;
        liveData.timeOfRunning = timeofruns[0] + ':' + timeofruns[1] + ':' + timeofruns[2];
      }
      const speedlist = liveData.speed ? liveData.speed.split('records') : null;
      if (speedlist && speedlist.length > 1) {
        speedlist[0] = Math.round(speedlist[0] * 10000) / 10000;
        liveData.speed = speedlist[0] + 'records' + speedlist[1];
      }
      const dataRanges = liveData.defaultDataRange ? liveData.defaultDataRange.split(',') : null;
      if (dataRanges && dataRanges.length > 1) {
        liveData.minDataRange = dataRanges[0];
        liveData.maxDataRange = dataRanges[1];
      }
      this.tempSlectedProcess = liveData;
    }
  }
  updateTableData(data) {
    if (data && data.length && data.length > 0) {
      this.forecastProcLiveData = data;
      this.forecastProcLiveData = data.map(it => {
        it.checkboxdata = this.tempforecastprocess.find((el) => el.dataId === it.dataId).checkboxdata ? true : false;
        return it;
      });
      this.tempforecastprocess = this.forecastProcLiveData;
    }
  }
  // on search
  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    this.emptyDetails();
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
      // alert("Invalid page number")
    } else {
      this.config.currentPage = inputVal;
      this.emptyDetails();
    }
  }

  // onpage change
  changepage(evt) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
    this.emptyDetails();
  }

  // set new page size for pagination
  setNewPageSize(pageSize) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.emptyDetails();
  }
  /*************************************Sumit Code End********* */
  // Modal popup Modelpop up open code Starts Here
  opentEditpopup(selectedProcess) {

    const dialogRef = this.dialog.open(EditForecastprocessingComponent, {
      width: '787px',
      disableClose: true,
      data: { modelConfigName: selectedProcess.modelConfigName }
    });


    return dialogRef.afterClosed().pipe(map(result => {
      return result;
    }));
  }

  // Modal popup for stop forecast
  openStopmodal(model) {

    const dialogRef = this.dialog.open(StopForecastProcessComponent, {
      width: '787px',
      data: {
        dataSet: this.selectedModel
      },
      disableClose: true
    });


    return dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.getdatatableAPI(true);
      }
    });
  }
  sort(key) {
    // this.key = key;
    // this.reverse = !this.reverse;
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
    this.emptyDetails();
  }
  getFirstSelectedDataObj(forecastDetails: any) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < forecastDetails.length; i++) {
      if (forecastDetails[i].jobStatus && forecastDetails[i].jobStatus.toLowerCase() !== 'waiting') {
        return Object.assign({}, forecastDetails[i]);
      }
    }
  }

  // ForecastProcessingtable Api starts here
  getdatatableAPI(enableLoader) {
    if (enableLoader) {
      this.forecastData = [];
      this.isLoading = true;
    }
    const userData = { dataSetName: 'ALL' };
    this.forecastService.forecastProcessingtable(userData).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status === 'success') {
        this.forecastData = data && data.data ? data.data : [];
        this.tempforecastprocess = this.forecastData.map(it => {
          it.checkboxdata = false;
          return it;
        });
        if (this.tempforecastprocess.length > 0) {
          const selectedData = this.getFirstSelectedDataObj(this.tempforecastprocess);
          this.selectedModel = {};
          this.displayModel(selectedData, enableLoader);
        }
      } else {
        this.tempforecastprocess = [];
        this.notify.showToastrWarning('Alert', 'Exception occured');
        this.isLoading = false;
      }
      this.masterData = this.tempforecastprocess;
      this.createDataSetList();
    }, err => {
      this.isLoading = false;
      this.tempforecastprocess = [];
      this.notify.showToastrError('Alert', 'Server error occured');
    });
  }

  // Function will create data set list for dropdown
  createDataSetList() {
    const dataSetListTemp = this.masterData.filter((thing, i, arr) => {
      return arr.indexOf(arr.find(t => t.dataSetName.toLowerCase() === thing.dataSetName.toLowerCase())) === i;
    }).map((elem, i) => {
      return elem.dataSetName;
    });
    this.selectionDataSet = [...dataSetListTemp];
  }
  // Edit functionality starts here

  editforecast(forecastEdit) {
    this.editforecastObject = forecastEdit;
    this.editforecastName = this.editforecastObject.pmId;
    this.threadId = this.editforecastObject.threadId;
    this.editSampletime = this.editforecastObject.sampleTime;
    let datarangesplit = this.editforecastObject.defaultDataRange;
    if (datarangesplit == null || datarangesplit === undefined) {
      datarangesplit = '';
    }
    const convertdatarange = datarangesplit.split(',');
    this.mintime = convertdatarange[0];
    this.maxtime = convertdatarange[1];
    this.editid = this.editforecastObject.id;
    this.editne = this.editforecastObject.ne;
    this.pmType = this.editforecastObject.pmType;
    this.podNumber = this.editforecastObject.podNumber;
    this.jobStatus = this.editforecastObject.jobStatus;
    const frwdprdata = this.editforecastObject.timeForForwardPrediction;
    this.editForecastparam = this.editforecastObject.modelParameter;
    this.frwrdPredict = frwdprdata.toString().replace(/\D/g, '');
    const replaceString = frwdprdata.toString().replace(/[^a-z]/gi, '');
    this.editSeconds = true;
    if (replaceString === 'h') {
      this.editHours = true;
      this.editDays = false;
      this.editSeconds = false;
      this.editMinutes = false;
    } else if (replaceString === 'm') {
      this.editMinutes = true;
      this.editHours = false;
      this.editDays = false;
      this.editSeconds = false;
    } else if (replaceString === 's') {
      this.editSeconds = true;
      this.editMinutes = false;
      this.editHours = false;
      this.editDays = false;
    } else if (replaceString === 'D') {
      this.editDays = true;
      this.editSeconds = false;
      this.editMinutes = false;
      this.editHours = false;
    }

    this.checkmodelparam();
  }

  // Edit form Ends Here
  toggleicons(x) {
    x.classList.toggle('fa-chevron-circle-right');
  }
  toggleShow() {
    this.isShown = !this.isShown;
  }
  toggleView() {
    this.toggle = !this.toggle;
  }
  // toggleViewright(){
  //   document.getElementById('collapse_div').style.marginLeft = "0";
  // }
  checkmodelparam() {
    this.forecastService.getModelConfig().subscribe((data: any) => {
      if (data.status !== 'fail') {
        this.ModelConfigArr = [];
        this.ModelConfigArr.push(...data.data);
        this.ModelConfigArr.push(this.editForecastparam);
      }
    });
  }

  // Edit form Starts here
  // openforecastEdit(edittemplate: TemplateRef<any>) {
  //   this.modalEditRef = this.modalService.show(edittemplate);
  // }
  // Edit form Ends here

  checkAlls(ev) {
    this.tempforecastprocess.forEach(x => x.checkboxdata = ev.target.checked);
  }

  isAllChecked() {
    if (this.tempforecastprocess.length === 0) {
      return false;
    } else {
      return this.tempforecastprocess.every(_ => _.checkboxdata);
    }
  }

  emptyDetails() {
    this.selectedProcess = {};
    this.tempSlectedProcess = {};
    this.selectedModel = {};
    this.scheduleSocForProc(this.refreshDataId);
  }


}
