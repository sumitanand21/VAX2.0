import { Component, OnInit, TemplateRef, Inject, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import 'rxjs/add/operator/map';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForecastService } from '../../services/forecast.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NUMBER } from '@amcharts/amcharts4/core';


// New Dialoge Componet Starts Here
@Component({
  selector: 'app-edit-forecast-selection',
  templateUrl: './Editforecastmodal.html',
  styleUrls: ['./forecast-selection.component.css']
})
export class EditForecastselectionComponent implements OnInit {
  edictRadio: any;
  // saveforecastAPI:any;
  closeforecastEdit: any;
  sample: any;
  input: any;
  headers: any;
  forecastData: any[];
  tempforecast: any[];
  ModelConfigArr: any = [];
  modalEditRef: BsModalRef;
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
  key = 'name';
  selectedDataId = '';
  reverse = false;
  p = 1;
  private pageSize = 10;
  constructor(
    public global: GlobalService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditForecastselectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notify: NotificationService,
    public forecastService: ForecastService) { }

  ngOnInit() {
    this.editforecastObject = this.data.forecastEdit;
    this.editforecastName = this.editforecastObject.dataId;
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
    this.editForecastparam = this.editforecastObject.modelConfigName;
    this.frwrdPredict = frwdprdata.toString().replace(/\D/g, '');
    const replaceString = frwdprdata.toString().replace(/[^a-z]/gi, '');
    this.editSeconds = true;
    this.checkmodelparam();

  }

  saveforecastAPI() {
    const Mintimeval = Number(this.mintime);
    const Maxtimeval = Number(this.maxtime);
    if (this.mintime === null || this.mintime === undefined || this.mintime === '' ||
        this.maxtime === null || this.maxtime === undefined || this.maxtime === '') {
      this.global.opendisplayModal('Please provide all the details', 'OK', 'Alert');
    } else if (this.maxtime > 4294967295) {
      this.global.opendisplayModal('Max Time cant be greater than 4294967295', 'OK', 'Alert');
    } else if (Maxtimeval < Mintimeval) {
      this.global.opendisplayModal('Min Time cant be greater than Max Time', 'OK', 'Alert');
    } else {
    const minTimeedit = this.mintime + ',' + this.maxtime;
    const data = {
      dataId: this.editforecastName,
      sampleTime: this.editSampletime,
      ne: this.editne,
      pmType: this.editforecastObject.pmType,
      defaultDataRange: minTimeedit,
      timeForForwardPrediction: this.frwrdPredict,
      modelConfigName: this.editForecastparam,
      jobStatus: this.editforecastObject.jobStatus,
      dataSetName: this.editforecastObject.dataSetName
    };
    this.forecastService.ForecastSelectionUpdatetable(data).subscribe((res: any) => {
      if (res.status === 'success') {
        this.notify.showToastrSuccess('Success', 'ForecastData Updated successfully.');
        this.returnvalue(data);
      } else {
        this.notify.showToastrWarning('Alert', 'Exception occured');
        this.dialogRef.close();
      }
    }, err => {
      this.notify.showToastrError('Alert', 'Server error occured');
      this.dialogRef.close();
    });
  }
  }
  returnvalue(updatedData?) {
    this.dialogRef.close(updatedData);
  }
  checkmodelparam() {
    const data = { jobType: 'FORECAST' };
    this.forecastService.getAllModelConfigs(data).subscribe((res: any) => {
      if (res.status === 'success') {
        this.ModelConfigArr = res.data && res.data.length > 0 ? res.data.map(it => it.modelConfigName) : [];
      } else {
        this.ModelConfigArr = [];
      }
    }, (error) => {
      this.ModelConfigArr = [];
    });
  }
}



@Component({
  selector: 'app-forecast-selection',
  templateUrl: './forecast-selection.component.html',
  styleUrls: ['./forecast-selection.component.css']
})
export class ForecastSelectionComponent implements OnInit, OnDestroy {
  defaultJobType = 'EXECUTION';
  defaultModelType = 'FORECAST';
  edictRadio: any;
  saveforecastAPI: any;
  closeforecastEdit: any;
  // tslint:disable-next-line:ban-types
  selectedRow: Number;
  // tslint:disable-next-line:ban-types
  setClickedRow: Function;
  sample: any;
  input: any;
  Loader = true;
  isLoading = true;
  headers: any;
  forecastData: any[] = [];
  tempforecast: any[] = [];
  tableData: any = [];
  ModelConfigArr: any = [];
  modalEditRef: BsModalRef;
  foretableLength: any = 0;
  forecastDisabled = true;
  editforecastObject: any;
  editforecastName: any;
  threadId: any;
  editSampletime: any;
  editmodelConfigName: any;
  mintime: any;
  maxtime: any;
  editid: any;
  masterData = [];
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

  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage = this.defauultItempg;
  inputCurrentpage = this.defaultCurrentPage;
  searchFilter = '';
  selectedDataId = '';
  selectionDataSet: any = [];
  // selectionDataSet = ["ALL","Slope","OPR","OPRMAX"]
  pageArr = [25, 50, 100];
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  key = 'name';
  reverse = false;
  p = 1;
  private pageSize = 10;
  constructor(
    public forecastService: ForecastService,
    public dialog: MatDialog,
    private notify: NotificationService,
    public global: GlobalService) {

  }

  ngOnInit() {
    this.getdatatableAPI();
    // this.getDatasetlist();
    this.forecastService.ForeCastSelection = true;
    this.setClickedRow = function(index) {
      this.selectedRow = index;
    };

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
    this.forecastService.ForeCastSelection = false;
  }
  // Modal popup Modelpop up open code Starts Here
  opentEditpopup(forecastEdit) {
    // tslint:disable-next-line:prefer-const
    let editforecastObj = Object.assign({}, forecastEdit);
    delete editforecastObj.checkboxdata;
    const dialogRef = this.dialog.open(EditForecastselectionComponent, {
      width: '787px',
      disableClose: true,
      data: { forecastEdit }
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        const index = this.tempforecast.findIndex(it => it.dataId === res.dataId);
        this.tempforecast[index].modelConfigName = res.modelConfigName;
        this.tempforecast[index].timeForForwardPrediction = res.timeForForwardPrediction;
        this.tempforecast[index].defaultDataRange = res.defaultDataRange;
      }
    });

  }

  loadData() {
    const model = this.masterData.find(elem => elem.dataSetName === this.selectedDataId);
    this.searchFilter = '';
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
  }
  /*************************************Sumit Code Starts********* */

  // on search
  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
    } else {
      this.config.currentPage = inputVal;
    }
  }

  // onpage change
  changepage(evt) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
  }

  // set new page size for pagination
  setNewPageSize(pageSize) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
  }
  /*************************************Sumit Code End********* */
  sort(key) {
    // this.key = key;
    // this.reverse = !this.reverse;
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
  }
  getdatatableAPI() {
    this.isLoading = true;
    this.forecastData = [];
    const userData = { dataSetName: 'ALL' };
    this.forecastService.ForecastSelectiontable(userData).subscribe((data: any) => {
      this.isLoading = false;
      if (data.status === 'success') {
        this.forecastData = data && data.data ? data.data : [];
        this.tempforecast = this.forecastData.map(it => ({ ...it, checkboxdata: false }));
      } else {
        this.tempforecast = [];
        this.notify.showToastrWarning('Alert', 'Exception occured');
        this.isLoading = false;
      }
      this.masterData = this.tempforecast;
      this.createDataSetList();
    }, err => {
      this.isLoading = false;
      this.tempforecast = [];
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
  checkmodelparam() {
    this.ModelConfigArr = [];
    this.ModelConfigArr.push(this.editForecastparam);
  }


  checkAlls(ev) {
    this.tempforecast.forEach(x => x.checkboxdata = ev.target.checked);
  }

  isAllChecked() {
    if (this.tempforecast.length === 0) {
      return false;
    } else {
      return this.tempforecast.every(it => it.checkboxdata === true);
    }

  }

  // Schedule Forecast Selection on forecast button click
  scheduleSelection() {
    const selectedScheduleData = this.tempforecast.filter(it => it.checkboxdata === true);
    if (selectedScheduleData.length > 0) {
      this.global.opendisplayModal('' + selectedScheduleData.length +
        ' Forecasts will be processed', 'Confirm', 'Forecast Processing', true).subscribe(result => {
          if (result === 'save') {
            const scheduleForecastArr = selectedScheduleData.map(it => {
              return Object.assign({
                dataId: it.dataId,
                dataSetName: it.dataSetName,
                defaultDataRange: it.defaultDataRange,
                jobStatus: it.jobStatus,
                jobType: this.defaultJobType,
                modelConfigName: it.modelConfigName,
                modelType: this.defaultModelType,
                ne: it.ne,
                pmType: it.pmType,
                sampleTime: it.sampleTime,
                timeForForwardPrediction: it.timeForForwardPrediction
              });
            });
            const data = { scheduleForecast: scheduleForecastArr };
            this.forecastService.scheduleSelectionDetails(data).subscribe((res: any) => {
              if (res && res.status === 'success') {
                this.notify.showToastrSuccess('Success', 'Selection details scheduled successfully');
                this.tempforecast = this.tempforecast.filter(item => !(scheduleForecastArr.some(it => it.dataId === item.dataId)));
                this.getdatatableAPI();
              } else {
                this.notify.showToastrWarning('Alert', 'Exception occured');
              }
            }, err => {
              this.notify.showToastrError('Alert', 'Server error occured');
            });
          }
        });

    } else {
      this.global.opendisplayModal('At least one selection data should be selected to proceed', 'OK', 'Alert');
    }

  }

  // disable or enable forecast button
  atLeastOneChecked() {
    return this.tempforecast.some(it => it.checkboxdata === true);
  }


}
