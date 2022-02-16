import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {ChangeDetectorRef } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { ForecastService } from '../../services/forecast.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-update-modelconfig',
  templateUrl: './update-modelconfig.component.html',
  styleUrls: ['./update-modelconfig.component.css']
})
export class UpdateModelconfigComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('modeledit', { static: true }) public modelEditFrm: NgForm;
  leastOneAlpha: any = new RegExp(/.*[a-zA-Z]+.*/);
  maskNumregex: any = new RegExp(/^[0-9]+\,\s[0-9]+$/);
  // maskL1l2Numregex: any = new RegExp(/(?:0*(?:\.\d+|,)?|1(\.0*)?)/);
  maskL1l2Numregex: any = new RegExp(/^(?:0*(?:\.\d+)?|1(\.0+)?)(\, )(?:0*(?:\.\d+)?|1(\.0+)?)$/);
  saveDisable = true;
  scalarTypeDD = [];
  EncoderTypeDD = [];
  optimizerDD = [];
  metricsDD = [];
  lossDD = [];
  isLoading = true;
  innerActivationDD = [];
  activationDD = [];
  defaultJobType = 'EXECUTION';
  defaultModelType = 'FORECAST';
  modelConfigName = '';
  modelObject: any = Object.assign({}, this.craeteModelObject(null));
  modelConfigPath = this.forecastService.activatedPath.replace('/updateconfig', '');

  constructor(
    public global: GlobalService,
    public forecastService: ForecastService,
    public cdRef: ChangeDetectorRef,
    private notify: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
      this.forecastService.activatedPath = this.forecastService.activatedPath.replace('/updateconfig', '');
      this.activatedRoute.queryParams.subscribe(queryParams => {
      this.forecastService.ForecastmodelName = queryParams.name ? queryParams.name : '';
      this.modelConfigName = this.forecastService.ForecastmodelName;
    });
  }

  ngOnInit() {
    this.modelEditFrm.form.markAsPristine();
    this.forecastService.ForecastModel = true;
    this.forecastService.ForeCastUpdateModel = true;
    this.getModelDropDownDetails();
  }

  getModelDropDownDetails() {
    this.isLoading = true;
    const data = { jobType: this.defaultModelType };
    this.forecastService.getConfigurationModelConfig().subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.status === 'success' && res.data && res.data.length > 0) {
        const modelconfDD = res.data[0].forecast;
        this.setAllDropDown(modelconfDD);
      } else {
        this.isLoading = false;
        this.setAllDropDown(null);
        this.notify.showToastrWarning('Alert', 'Exception occured');

      }
    }, err => {
      this.isLoading = false;
      this.setAllDropDown(null);
      this.notify.showToastrError('Alert', 'Server error occured');
    });
  }

  setAllDropDown(modelconfDD) {
    this.scalarTypeDD = modelconfDD && modelconfDD.scalar ? modelconfDD.scalar : [];
    this.EncoderTypeDD = modelconfDD && modelconfDD.encoder ? modelconfDD.encoder : [];
    this.optimizerDD = modelconfDD && modelconfDD.optimizer ? modelconfDD.optimizer : [];
    this.metricsDD = modelconfDD && modelconfDD.metrics ? modelconfDD.metrics : [];
    this.lossDD = modelconfDD && modelconfDD.loss ? modelconfDD.loss : [];
    this.innerActivationDD = modelconfDD && modelconfDD.inneractivation ? modelconfDD.inneractivation : [];
    this.activationDD = modelconfDD && modelconfDD.activation ? modelconfDD.activation : [];
    if (modelconfDD !== null) {
      this.getModelConfigData();
    }
  }


  getModelConfigData() {
    this.isLoading = true;
    if (this.modelConfigName) {
      const data = { jobType: this.defaultModelType, modelConfig: this.modelConfigName };
      this.forecastService.getModelConfigDetails(data).subscribe((res: any) => {
        this.isLoading = false;
        if (res && res.status === 'success' && res.data && Object.keys(res.data).length > 0) {
          const modelconf = res.data;
          this.modelObject = this.craeteModelObject(modelconf);
        }
      }, err => {
        this.isLoading = false;
        this.notify.showToastrError('Alert', 'Server error occured');
      });
    } else {
      this.isLoading = false;
      this.modelObject = this.craeteModelObject(null);
    }
  }


  navigateTo(navigationpath) {
    this.router.navigate([navigationpath]);
  }

  deleteModelConfig() {
  this.global.opendisplayModal('Do you wish to delete this model configuration',
  'Confirm', 'Delete Model Configuration', true).subscribe(result => {
    if (result === 'save') {
    const modelconfigObj = this.craeteModelObject(this.modelObject);
    const data = { jobType: this.defaultModelType, modelConfig: modelconfigObj };
    this.forecastService.deleteModelConfigDetails(data).subscribe((res: any) => {
        if (res && res.status === 'success' && res.data.deletedCount !== 0) {
          this.notify.showToastrSuccess('Success', 'Model deleted successfully.');
          this.navigateTo(this.modelConfigPath);
        } else {
          this.notify.showToastrWarning('Alert', 'Exception occured');
        }

      }, err => {
        this.notify.showToastrError('Alert', 'Server error occured');
      });
    }
  });

  }

  saveModelDetails() {

    if (this.modelEditFrm.invalid) {
    this.global.opendisplayModal('Please provide all the model details', 'OK', 'Alert');
      // this.notify.showToastrWarning('Alert', 'Please provide all the model details.');
    } else if (this.modelObject.modelConfigName.length < 3) {
      this.global.opendisplayModal('Name provided should be atleast 3 characters long', 'OK', 'Alert');
    } else if (!this.leastOneAlpha.test(this.modelObject.modelConfigName)) {
      this.global.opendisplayModal('Name provided should have atleast 1 character(A-Z)', 'OK', 'Alert');
    } else if (!this.maskNumregex.test(this.modelObject.inputShape)) {
      this.global.opendisplayModal('Input Shape value should be in format 0, 0', 'OK', 'Alert');
    } else if (this.modelObject.dropout < 0 || this.modelObject.dropout > 1) {
      this.global.opendisplayModal('Drop Out value should be between 0 and 1', 'OK', 'Alert');
    } else if (!this.maskL1l2Numregex.test(this.modelObject.l1L2)) {
      // tslint:disable-next-line:max-line-length
      this.global.opendisplayModal('L1, L2 value should be in format 0.0, 0.0 and should be in the range (0.0 - 1.0), (0.0 - 1.0)', 'OK', 'Alert');
    } else {
      if (this.modelConfigName) {
        this.UpdateModelConfig();
      } else {
        this.createModelConfig();
      }

    }
  }

  createModelConfig() {
    const modelconfigObj = this.craeteModelObject(this.modelObject);
    const modelConfreq = {forecastModelConfig : modelconfigObj , reponseMessage: '', responseType: 'CONF'};
    const data = { jobType: this.defaultModelType, modelConfig: modelConfreq };
    this.forecastService.createModelConfigDetails(data).subscribe((res: any) => {
      if (res && res.status === 'success' && res.data.responseType !== 'ERR') {
        this.notify.showToastrSuccess('Success', 'Model created successfully.');
        this.navigateTo(this.modelConfigPath);
      } else if (res && res.status === 'success' && res.data.responseType === 'ERR') {
        this.notify.showToastrWarning('Alert', res.data.reponseMessage);
      } else {
        this.notify.showToastrWarning('Alert', 'Exception occured');
      }
    }, err => {
      this.notify.showToastrError('Alert', 'Server error occured');
    });
  }

  UpdateModelConfig() {
    const modelconfigObj = this.craeteModelObject(this.modelObject);
    const modelConfreq = {forecastModelConfig : modelconfigObj , reponseMessage: '', responseType: 'CONF'};
    const data = { jobType: this.defaultModelType, modelConfig: modelConfreq };
    this.forecastService.UpdateModelConfigDetails(data).subscribe((res: any) => {
      if (res && res.status === 'success' && res.data.responseType !== 'ERR') {
        this.modelConfigName = this.modelObject.modelConfigName;
        this.forecastService.ForecastmodelName =  this.modelConfigName;
        this.notify.showToastrSuccess('Success', 'Model updated successfully.');
        this.modelEditFrm.form.markAsPristine();
        this.navigateTo(this.modelConfigPath);
      } else if (res && res.status === 'success' && res.data.responseType === 'ERR') {
        this.notify.showToastrWarning('Alert', res.data.reponseMessage);
      } else {
        this.notify.showToastrWarning('Alert', 'Exception occured');
      }

    }, err => {
      this.notify.showToastrError('Alert', 'Server error occured');
    });
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
    // if (this.modelEditFrm.dirty) {
    //   this.saveDisable = false;
    // } else {
    //   this.saveDisable = true;
    // }

     }

  ngOnDestroy(): void {
    this.forecastService.ForecastmodelName = '';
    this.forecastService.ForecastModel = false;
    this.forecastService.ForeCastUpdateModel = false;
  }


  craeteModelObject(modelConfigObj) {
    const newModelConfig = {
      id : modelConfigObj && modelConfigObj.id ? modelConfigObj.id : '',
      modelConfigName : modelConfigObj && modelConfigObj.modelConfigName ? modelConfigObj.modelConfigName : '',
      modelConfigCount : modelConfigObj && modelConfigObj.modelConfigCount ? modelConfigObj.modelConfigCount : 0,
      inputShape : modelConfigObj && modelConfigObj.inputShape ? this.setMaskNumVal(modelConfigObj.inputShape) : '',
      outputShape : modelConfigObj && modelConfigObj.outputShape ? modelConfigObj.outputShape : '',
      blockUnits : modelConfigObj && modelConfigObj.blockUnits ? modelConfigObj.blockUnits : '',
      batchSize : modelConfigObj && modelConfigObj.batchSize ? modelConfigObj.batchSize : '',
      epochs : modelConfigObj && modelConfigObj.epochs ? modelConfigObj.epochs : '',
      layers : modelConfigObj && modelConfigObj.layers ? modelConfigObj.layers : '',
      dropout : modelConfigObj && modelConfigObj.dropout ? modelConfigObj.dropout : '',
      activation : modelConfigObj && modelConfigObj.activation ? modelConfigObj.activation : this.activationDD[0],
      innerActivation : modelConfigObj && modelConfigObj.innerActivation ? modelConfigObj.innerActivation : this.innerActivationDD[0],
      loss : modelConfigObj && modelConfigObj.loss ? modelConfigObj.loss : this.lossDD[0],
      metrics : modelConfigObj && modelConfigObj.metrics ? modelConfigObj.metrics : this.metricsDD[0],
      optimizer : modelConfigObj && modelConfigObj.optimizer ? modelConfigObj.optimizer : this.optimizerDD[0],
      stateful : modelConfigObj && modelConfigObj.stateful ? modelConfigObj.stateful : 'True',
      l1L2 : modelConfigObj && modelConfigObj.l1L2 ? this.setMaskNumVal(modelConfigObj.l1L2) : '',
      nlags : modelConfigObj && modelConfigObj.nlags ? modelConfigObj.nlags : '',
      nleads : modelConfigObj && modelConfigObj.nleads ? modelConfigObj.nleads : '',
      exclude : modelConfigObj && modelConfigObj.exclude ? modelConfigObj.exclude : 'None',
      groupBy : modelConfigObj && modelConfigObj.groupBy ? modelConfigObj.groupBy : 'None',
      timeStep : modelConfigObj && modelConfigObj.timeStep ? modelConfigObj.timeStep : '',
      encoderType : modelConfigObj && modelConfigObj.encoderType ? modelConfigObj.encoderType : this.EncoderTypeDD[0],
      scalerType : modelConfigObj && modelConfigObj.scalerType ? modelConfigObj.scalerType : this.scalarTypeDD[0],
      testSize: modelConfigObj && modelConfigObj.testSize ? modelConfigObj.testSize : '',
      jobType : this.defaultJobType,
      modelType: this.defaultModelType
    };
    return Object.assign({}, newModelConfig);
    }

    setMaskNumVal(Value) {
       const splitVal = Value.split(',');
       const First = splitVal[0].trim();
       const Second = splitVal.length > 1 ? splitVal[1].trim()  : '';
       return Second ? (First + ', ' + Second) : First;

    }

}

