import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataManagementService } from '../../services/data-management.service';
import { NgForm } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-upsert-data-set',
  templateUrl: './upsert-data-set.component.html',
  styleUrls: ['./upsert-data-set.component.css']
})
export class UpsertDataSetComponent implements OnInit, OnDestroy {
  @ViewChild('upsertDataSet', { static: true }) public upsertFrm: NgForm;
  leastOneAlpha: any = new RegExp(/.*[a-zA-Z]+.*/);
  dataSetName = '';
  stored = '';
  stream = '';
  options = true;
  selectedConfiguration = '';
  configurationDD = [];
  featureDetails = [];
  fileName = '';
  bufferDataSet: any = null;
  initialLoad = false;
  upsertType = 'C'; // for create , 'U' for update
  featureLoader = false;
  jobTypeList = [];
  selectedJobType = [];
  configurationDet = {
    storeddataSourceList: [],
    selectedDataSource: '',
    selectedDataSrcObj: null,
    step1Obj: null,
    step2Obj: null,
    step1Name: '',
    step1DD: [],
    selectedStep1: '',
    step2Name: '',
    step2DD: [],
    selectedStep2: '',
  };
  propertyTypeList = [];
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage: number = this.defauultItempg;
  inputCurrentpage: number = this.defaultCurrentPage;
  pageArr = [25, 50, 100];
  config = {
    id: 'paginateFeature',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  searchFilter = '';

  constructor(
    public global: GlobalService,
    public notify: NotificationService,
    private router: Router,
    public dataManagementService: DataManagementService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.dataManagementService.showUpsertDataSet = true;
    this.getConfigurationDetailsList();
    this.getJobTypeList();
    this.getPropertyTypeList();
    this.initialLoad = true;
    if (this.dataManagementService.selectedDataSetName) {
      this.upsertType = 'U';
      this.getDataSetDetails(this.dataManagementService.selectedDataSetName);
    }
  }

  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
      // alert("Invalid page number")
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
  enableDropDown(featureDet) {
    featureDet.select = true;
  }
  disableDropDown(featureDet) {
    featureDet.select = false;
  }
  ngOnDestroy() {
    this.dataManagementService.showUpsertDataSet = false;
  }


  getDataSetDetails(selectedData) {
    const data = { dataSetName: selectedData };
    this.featureLoader = true;
    this.dataManagementService.getDatasourceDeatils(data).subscribe((res: any) => {
      this.featureLoader = false;
      if (res.status === 'success') {
        this.bufferDataSet = res.data && res.data.data ? res.data.data : null;
        this.dataSetName = this.bufferDataSet ? this.bufferDataSet.dataSetName : '';
        this.stored = this.bufferDataSet ? this.bufferDataSet.dataSourceType.some(it => it === 'stored_data') : false;
        this.stream = this.bufferDataSet ? this.bufferDataSet.dataSourceType.some(it => it === 'stream_data') : false;
        this.selectedJobType = this.bufferDataSet ? this.bufferDataSet.jobType : [];
        this.options = this.bufferDataSet && this.bufferDataSet.fileName ? false : true;
        this.selectedConfiguration = this.bufferDataSet ? this.bufferDataSet.configurationName : '';
        this.fileName = this.bufferDataSet ? this.bufferDataSet.fileName : '';

        const connectionDet = this.bufferDataSet && this.bufferDataSet.connectionDetails ? this.bufferDataSet.connectionDetails : null;
        if (connectionDet) {
          connectionDet.dbType = this.bufferDataSet && this.bufferDataSet.dbType ? this.bufferDataSet.dbType : '';
        }
        this.configurationDet.storeddataSourceList = connectionDet ? [connectionDet] : [];
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSource = this.configurationDet.storeddataSourceList.length > 0 ? this.configurationDet.storeddataSourceList[0].dbType : '';
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSrcObj = this.configurationDet.storeddataSourceList.length > 0 ? Object.assign({}, this.configurationDet.storeddataSourceList[0]) : null;

        if (this.options) {
          this.getAllStepDetails();
        } else {
          this.setFileDetails();
        }
      } else {
        this.bufferDataSet = null;
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set details');
        this.featureLoader = false;
      }
    },
      err => {
        this.bufferDataSet = null;
        this.featureLoader = false;
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set details');
      });

  }

  setFileDetails() {
    const step1Arr = this.bufferDataSet && this.bufferDataSet.configuration ?
      this.bufferDataSet.configuration.filter(it => it.type === 'step1') : [];
    const step1Obj = step1Arr.length > 0 ? step1Arr[0] : null;
    this.configurationDet.selectedStep1 = step1Obj && step1Obj.value ? step1Obj.value : '';
    this.configurationDet.step1Name = step1Obj && step1Obj.key ? step1Obj.key : '';
    this.configurationDet.step1DD = this.configurationDet.selectedStep1 ? [this.configurationDet.selectedStep1] : [];

    this.configurationDet.step1Obj = step1Obj ? Object.assign({
      stepName: this.configurationDet.step1Name,
      [this.configurationDet.step1Name]: this.configurationDet.step1DD
    }) : null;

    const step2Arr = this.bufferDataSet && this.bufferDataSet.configuration ?
      this.bufferDataSet.configuration.filter(it => it.type === 'step2') : [];
    const step2Obj = step2Arr.length > 0 ? step2Arr[0] : null;
    this.configurationDet.selectedStep2 = step2Obj && step2Obj.value ? step2Obj.value : '';
    this.configurationDet.step2Name = step2Obj && step2Obj.key ? step2Obj.key : '';
    this.configurationDet.step2DD = this.configurationDet.selectedStep2 ? [this.configurationDet.selectedStep2] : [];

    this.configurationDet.step2Obj = step2Obj ? Object.assign({
      stepName: this.configurationDet.step2Name,
      [this.configurationDet.step2Name]: [{
        database: this.configurationDet.selectedStep1,
        collections: this.configurationDet.step2DD
      }]
    }) : null;

    this.setFeatureDetailsOnLoad();

  }

  getJobTypeList() {
    this.dataManagementService.getJobType({}).subscribe((res: any) => {
      if (res.status === 'success') {
        this.jobTypeList = res.data && res.data.data && res.data.data.length > 0 ? res.data.data : [];
      } else {
        this.jobTypeList = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch job type list');
      }
    },
      err => {
        this.jobTypeList = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch job type list');
      });
  }

  getPropertyTypeList() {
    this.dataManagementService.getPropertyType({}).subscribe((res: any) => {
      if (res.status === 'success') {
        this.propertyTypeList = res.data && res.data.data && res.data.data.length > 0 ? res.data.data : [];
      } else {
        this.propertyTypeList = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch property type list');
      }
    },
      err => {
        this.propertyTypeList = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch property type list');
      });
  }

  getConfigurationDetailsList() {
    this.dataManagementService.getConfigurationList({}).subscribe((res: any) => {
      if (res.status === 'success') {
        this.configurationDD = res.data && res.data.data && res.data.data.length > 0 ? res.data.data : [];
      } else {
        this.configurationDD = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch configuration list');
      }
    },
      err => {
        this.configurationDD = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch configuration list');
      });
  }

  getConfigDetails(selectedConfig) {
    const data = { configurationName: selectedConfig };
    this.dataManagementService.getConfigurationDet(data).subscribe((res: any) => {
      if (res.status === 'success') {
        this.configurationDet.storeddataSourceList = res.data && res.data.data ? [res.data.data] : [];
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSource = this.configurationDet.storeddataSourceList.length > 0 ? this.configurationDet.storeddataSourceList[0].dbType : '';
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSrcObj = this.configurationDet.storeddataSourceList.length > 0 ? Object.assign({}, this.configurationDet.storeddataSourceList[0]) : null;
      } else {
        this.configurationDet.storeddataSourceList = [];
        this.configurationDet.selectedDataSource = '';
        this.configurationDet.selectedDataSrcObj = null;
        this.notify.showToastrWarning('Alert', 'API failed to fetch db type details');
      }
      this.getAllStepDetails();
    },
      err => {
        this.configurationDet.storeddataSourceList = [];
        this.configurationDet.selectedDataSource = '';
        this.configurationDet.selectedDataSrcObj = null;
        this.notify.showToastrWarning('Alert', 'API failed to fetch db type details');
        this.getAllStepDetails();
      });
  }


  getAllStepDetails() {
    if (this.configurationDet.selectedDataSrcObj) {
      const data = Object.assign({}, this.configurationDet.selectedDataSrcObj);
      this.dataManagementService.getStepsDetails(data).subscribe((res: any) => {
        if (res.status === 'success') {
          this.configurationDet.step1Obj = res.data && res.data.data && res.data.data.step1 ? res.data.data.step1 : null;
          this.configurationDet.step2Obj = res.data && res.data.data && res.data.data.step2 ? res.data.data.step2 : null;

          this.configurationDet.step1Name = this.configurationDet.step1Obj && this.configurationDet.step1Obj.stepName ?
            this.configurationDet.step1Obj.stepName : '';

          this.configurationDet.step1DD = this.configurationDet.step1Obj &&
            this.configurationDet.step1Obj[this.configurationDet.step1Name] ?
            [...this.configurationDet.step1Obj[this.configurationDet.step1Name]] : [];

          if (this.initialLoad === true && this.upsertType === 'U') {
            const step1Arr = this.bufferDataSet && this.bufferDataSet.configuration ?
              this.bufferDataSet.configuration.filter(it => it.type === 'step1') : [];
            const step1Obj = step1Arr.length > 0 ? step1Arr[0] : null;
            this.configurationDet.selectedStep1 = step1Obj && step1Obj.value ? step1Obj.value : '';
          } else {
            this.configurationDet.selectedStep1 = '';
          }
          this.onStep1Change(this.configurationDet.selectedStep1);

        } else {
          this.initialLoad = false;
          this.resetSteps();
          this.notify.showToastrWarning('Alert', 'API failed to fetch step details');
        }
      },
        err => {
          this.initialLoad = false;
          this.resetSteps();
          this.notify.showToastrWarning('Alert', 'API failed to fetch step details');
        });
    } else {
      this.initialLoad = false;
      this.resetSteps();
    }
  }

  resetStep2() {
    this.configurationDet.step2Name = '';
    this.configurationDet.step2DD = [];
    this.configurationDet.selectedStep2 = '';
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.searchFilter = '';
  }

  resetSteps() {
    this.configurationDet.step1Obj = null;
    this.configurationDet.step2Obj = null;
    this.configurationDet.step1Name = '';
    this.configurationDet.step1DD = [];
    this.configurationDet.selectedStep1 = '';
    this.configurationDet.step2Name = '';
    this.configurationDet.step2DD = [];
    this.configurationDet.selectedStep2 = '';
    this.featureDetails = [];
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.searchFilter = '';
  }

  onOptionChange() {
    this.resetAllFeilds();
  }

  resetAllFeilds() {
    this.selectedConfiguration = '';
    this.fileName = '';
    this.configurationDet.storeddataSourceList = [];
    this.configurationDet.selectedDataSource = '';
    this.configurationDet.selectedDataSrcObj = null;
    this.configurationDet.step1Obj = null;
    this.configurationDet.step2Obj = null;
    this.configurationDet.step1Name = '';
    this.configurationDet.step1DD = [];
    this.configurationDet.selectedStep1 = '';
    this.configurationDet.step2Name = '';
    this.configurationDet.step2DD = [];
    this.configurationDet.selectedStep2 = '';
    this.featureDetails = [];
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.searchFilter = '';
  }

  onStep1Change(selectedStep1) {
    if (this.configurationDet.step2Obj) {
      this.configurationDet.step2Name = this.configurationDet.step2Obj && this.configurationDet.step2Obj.stepName ?
        this.configurationDet.step2Obj.stepName : '';

      this.configurationDet.step2DD = this.filterStep2DD(this.configurationDet.step2Name, selectedStep1);

      if (this.initialLoad === true && this.upsertType === 'U') {
        const step2Arr = this.bufferDataSet && this.bufferDataSet.configuration ?
          this.bufferDataSet.configuration.filter(it => it.type === 'step2') : [];
        const step2Obj = step2Arr.length > 0 ? step2Arr[0] : null;
        this.configurationDet.selectedStep2 = step2Obj && step2Obj.value ? step2Obj.value : '';
        this.setFeatureDetailsOnLoad();
      } else {
        this.configurationDet.selectedStep2 = '';
      }
    } else {
      this.resetStep2();
      if (this.initialLoad === true && this.upsertType === 'U') {
        this.setFeatureDetailsOnLoad();
      } else {
        this.featureDetails = [];
      }
    }
  }

  setFeatureDetailsOnLoad() {
    this.featureDetails = this.bufferDataSet && this.bufferDataSet.featureMapping ?
      this.bufferDataSet.featureMapping.map(it => Object.assign({ ...it, select: false })) : [];
    this.initialLoad = false;
  }

  filterStep2DD(stepName, selectedStep1) {
    let stepDD = [];
    if (stepName) {
      const Step2 = this.configurationDet.step2Obj &&
        this.configurationDet.step2Obj[stepName] ?
        this.configurationDet.step2Obj[stepName].filter(it => it.database === selectedStep1) : [];
      stepDD = Step2.length > 0 && Step2[0].collections ? [...Step2[0].collections] : [];
    }
    return stepDD;

  }

  getFeatureListValidation() {
    if (this.upsertFrm.invalid) {
      this.global.opendisplayModal('Please provide all the details to fetch features', 'OK', 'Alert');
    } else if (!this.options && !this.fileName) {
      this.global.opendisplayModal('Please provide all the details to fetch features', 'OK', 'Alert');
    } else {
      this.getFeatureList();
    }
  }

  getFeatureList() {
    const data = Object.assign({}, this.configurationDet.selectedDataSrcObj);
    if (this.configurationDet.step1Name) {
      data[this.configurationDet.step1Name] = this.configurationDet.selectedStep1;
    }
    if (this.configurationDet.step2Name) {
      data[this.configurationDet.step2Name] = this.configurationDet.selectedStep2;
    }
    this.featureLoader = true;
    this.dataManagementService.getFeatureDet(data).subscribe((res: any) => {
      if (res.status === 'success') {
        this.featureDetails = res.data && res.data.data ? res.data.data.map(it => Object.assign({ ...it, select: false })) : [];
      } else {
        this.featureDetails = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch feature');
      }
      this.featureLoader = false;
    },
      err => {
        this.featureDetails = [];
        this.featureLoader = false;
        this.notify.showToastrWarning('Alert', 'API failed to fetch feature');
      });
  }

  saveDataSetDetails() {
    if (this.upsertFrm.invalid) {
      this.global.opendisplayModal('Please provide all the details to save data set', 'OK', 'Alert');
    } else if (this.dataSetName.length < 3) {
      this.global.opendisplayModal('Name provided should be atleast 3 characters long', 'OK', 'Alert');
    } else if (!this.leastOneAlpha.test(this.dataSetName)) {
      this.global.opendisplayModal('Name provided should have atleast 1 character(A-Z)', 'OK', 'Alert');
    } else if (!this.options && !this.fileName) {
      this.global.opendisplayModal('Please provide all the details to fetch features', 'OK', 'Alert');
    } else if (this.featureDetails.length === 0) {
      this.global.opendisplayModal('At least one feature should be available to save data set', 'OK', 'Alert');
    } else if (this.featureDetails.some(it => it.select === true)) {
      this.global.opendisplayModal('Accept all features property changes to save data set', 'OK', 'Alert');
    } else {
      this.saveDataSetObjCreate();
    }

  }

  saveDataSetObjCreate() {
    const fetaureList = this.featureDetails.map((addColumn) => {
      const newColumn = Object.assign({}, addColumn);
      delete newColumn.select;
      return newColumn;
    });
    const dataSrcType = [];
    const steps = [];
    if (this.stored) {
      dataSrcType.push('stored_data');
    }
    if (this.stream) {
      dataSrcType.push('stream_data');
    }
    if (this.configurationDet.step1Name) {
      steps.push({ key: this.configurationDet.step1Name, value: this.configurationDet.selectedStep1, type: 'step1' });
    }
    if (this.configurationDet.step2Name) {
      steps.push({ key: this.configurationDet.step2Name, value: this.configurationDet.selectedStep2, type: 'step2' });
    }
    const data = {
      dataSetName: this.dataSetName,
      dataSourceType: dataSrcType,
      jobType: this.selectedJobType,
      fileName: !this.options ? this.fileName : '',
      configurationName: this.options ? this.selectedConfiguration : '',
      dbType: this.configurationDet.selectedDataSource,
      configuration: steps,
      featureMapping: fetaureList,
      connectionDetails: this.configurationDet.selectedDataSrcObj,
    };

    if (this.upsertType === 'C') {
      this.createDataSetDetails(data);
    } else {
      this.updateDataSetDetails(data);
    }
  }

  updateDataSetDetails(data) {
    this.dataManagementService.updateDataSet(data).subscribe((res: any) => {
      if (res.status === 'success') {
        if (res.data && res.data.responseType && res.data.responseType === 'ERR') {
          this.notify.showToastrWarning('Alert', res.data.message);
        } else {
          this.notify.showToastrSuccess('Success', 'Data set updated successfully');
          this.upsertType = 'U';
        }
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to update data set');
      }
    },
      err => {
        this.notify.showToastrWarning('Alert', 'API failed to update data set');
      });
  }

  createDataSetDetails(data) {
    this.dataManagementService.createDataSet(data).subscribe((res: any) => {
      if (res.status === 'success') {
        if (res.data && res.data.responseType && res.data.responseType === 'ERR') {
          this.notify.showToastrWarning('Alert', res.data.message);
        } else {
          this.notify.showToastrSuccess('Success', 'Data set created successfully');
          this.router.navigate(['/datamanagement/datasource']);
        }
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to create data set');
      }
    },
      err => {
        this.notify.showToastrWarning('Alert', 'API failed to create data set');
      });
  }

  saveFileTOBlob(evt) {
    if (evt && evt.target && evt.target.files && evt.target.files.length > 0) {
      const file: File = evt.target.files[0];
      const fileExtension = (file.name) ? (file.name.split('.').pop()) : '';
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (event: any) => {
        const arrayBuffer: any = reader.result;
        const uint = new Uint8Array(arrayBuffer);
        const bytes = [];
        for (let j = 0; j < 4; j++) {
          bytes.push(uint[j].toString(16));
        }
        let hex = bytes.join('').toUpperCase();
        hex = hex.slice(0, 4);
        if (fileExtension === 'xlsx' || fileExtension === 'csv' || fileExtension === 'xls' || hex === '4D5A') {
          this.fileName = file.name;
          evt.srcElement.value = null;
          this.saveFile(file);
        } else {
          this.global.opendisplayModal('File type should be .xlsx, .xls or csv', 'OK', 'Alert');
          this.fileName = '';
          evt.srcElement.value = null;
          this.configurationDet.storeddataSourceList = [];
          this.configurationDet.selectedDataSource = '';
          this.configurationDet.selectedDataSrcObj = null;
          this.resetSteps();
        }

      };

    }
  }

  saveFile(file) {
    const fd: FormData = new FormData();
    fd.append('file_uploaded', file);
    this.dataManagementService.fileUpload(fd).subscribe((res: any) => {
      if (res.status === 'success') {
        const dtasrcObj = res.data ? Object.assign({}, res.data) : null;
        delete dtasrcObj.stepDetails;
        this.configurationDet.storeddataSourceList = dtasrcObj ? [dtasrcObj] : [];
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSource = this.configurationDet.storeddataSourceList.length > 0 ? this.configurationDet.storeddataSourceList[0].dbType : '';
        // tslint:disable-next-line:max-line-length
        this.configurationDet.selectedDataSrcObj = this.configurationDet.storeddataSourceList.length > 0 ? Object.assign({}, this.configurationDet.storeddataSourceList[0]) : null;

        this.configurationDet.selectedStep1 = '';
        this.configurationDet.step1Obj = res.data && res.data.stepDetails && res.data.stepDetails.step1 ? res.data.stepDetails.step1 : null;
        this.configurationDet.step2Obj = res.data && res.data.stepDetails && res.data.stepDetails.step2 ? res.data.stepDetails.step2 : null;

        this.configurationDet.step1Name = this.configurationDet.step1Obj && this.configurationDet.step1Obj.stepName ?
          this.configurationDet.step1Obj.stepName : '';

        this.configurationDet.step1DD = this.configurationDet.step1Obj &&
          this.configurationDet.step1Obj[this.configurationDet.step1Name] ?
          [...this.configurationDet.step1Obj[this.configurationDet.step1Name]] : [];
        this.resetStep2();
        this.featureDetails = [];
      } else {
        this.fileName = '';
        this.configurationDet.storeddataSourceList = [];
        this.configurationDet.selectedDataSource = '';
        this.configurationDet.selectedDataSrcObj = null;
        this.resetSteps();
        this.notify.showToastrWarning('Alert', 'API failed to fetch upload details');
      }
    },
      err => {
        this.fileName = '';
        this.configurationDet.storeddataSourceList = [];
        this.configurationDet.selectedDataSource = '';
        this.configurationDet.selectedDataSrcObj = null;
        this.resetSteps();
        this.notify.showToastrWarning('Alert', 'API failed to fetch upload details');
      });
  }


}
