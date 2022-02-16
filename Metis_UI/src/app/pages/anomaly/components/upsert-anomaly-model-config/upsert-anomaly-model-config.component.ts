import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AnomalyService } from '../../services/anomaly.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-upsert-anomaly-model-config',
  templateUrl: './upsert-anomaly-model-config.component.html',
  styleUrls: ['./upsert-anomaly-model-config.component.css']
})
export class UpsertAnomalyModelConfigComponent implements OnInit, OnDestroy {
  isNodeValueChanged = false;
  masterData = undefined;
  key = 'name';
  reverse = false;
  p = 1;
  private pageSize = 5;
  maskNumregex: any = new RegExp(/^[0-9]+\,\s[0-9]+$/);
  maskL1l2Numregex: any = new RegExp(/^(?:0*(?:\.\d+)?|1(\.0+)?)(\, )(?:0*(?:\.\d+)?|1(\.0+)?)$/);
  leastOneAlpha: any = new RegExp(/.*[a-zA-Z]+.*/);
  isActionTaken = false;
  isXfeaturesSelected = false;
  isTrainingFilterSeleceted = false;
  isStringFeatureSelected = false;
  modelConfigName;
  modelTypes = ['MODELI', 'MODELII'];
  selectedModel;
  modelConfigTempName = '';
  encoders;
  scalers;
  optimizers;
  activations;
  // tslint:disable-next-line:variable-name
  decoder_Activations;
  losses;
  selectAll = false;
  stringselectAll = false;
  uniqueselectAll = false;
  checked: boolean;
  metrics;
  datasets;
  uniqueFeatures;
  expression = false;
  editDays: any;
  all: any;
  modelconfI;
  modelconfII;
  //  startPageIndex: any = 0;
  //  endPageIndex: any = 5;
  xfeatures: any[] = [];
  sfeatures: any[] = [];
  tfeatures: any[] = [];
  nodeListLength = 0;
  detailLoader = false;
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage = this.defauultItempg;
  inputCurrentpage = this.defaultCurrentPage;
  searchFilterX = '';
  searchFilterT = '';
  searchFilterS = '';
  selecteddata = '1';
  masterDataLoading = true;
  masterDataLoadingSuccess = false;
  pageArr = [25, 50, 100];
  isAllItemsChecked = false;
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  upsertAnmModel = new FormGroup({
    id: new FormControl(),
    modelConfigName: new FormControl(),
    modelType: new FormControl(),
    encoder: new FormControl(),
    scaler: new FormControl(),
    optimizer: new FormControl(),
    activation: new FormControl(),
    decoder_activation: new FormControl(),
    loss: new FormControl(),
    epochs: new FormControl(),
    p_components: new FormControl(),
    dropout: new FormControl(),
    l1L2: new FormControl(),
    batchSize: new FormControl(),
    metrics: new FormControl(),
    nodes: new FormControl(),
    dataSetName: new FormControl(),
    trainingFilter: new FormControl(),
    xfeatureList: new FormControl(),
    uniqueFeature: new FormControl(),
    stringFeatures: new FormControl()
  });
  action;
  nodeList = [];
  modelConfigPath = this.anomalyService.activatedPath.replace('/upsertmodelconfig', '');

  constructor(
    private formBuilder: FormBuilder,
    public anomalyService: AnomalyService,
    private notfyService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public global: GlobalService
  ) {
    this.anomalyService.activatedPath = this.anomalyService.activatedPath.replace('/upsertmodelconfig', '');
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.anomalyService.AnomalymodelName = queryParams.name ? queryParams.name : '';
      this.anomalyService.AnomalymodelType = queryParams.type ? queryParams.type : '';
    });

  }

  ngOnInit() {
    this.anomalyService.AnomalyModel = true;
    this.anomalyService.AnomalyUpdateModel = true;
    if (this.anomalyService.AnomalymodelName &&
      this.anomalyService.AnomalymodelName !== null
      && this.anomalyService.AnomalymodelName !== null &&
      this.anomalyService.AnomalymodelType &&
      this.anomalyService.AnomalymodelType !== null
      && this.anomalyService.AnomalymodelType !== null) {
      this.action = 'Update';
      this.getMasterData();
    } else {
      this.action = 'Create';
      this.getMasterData();
    }
  }

  createForm(modelType) {
    if (this.upsertAnmModel &&
      this.upsertAnmModel.controls &&
      this.upsertAnmModel.controls.modelConfigName.value &&
      this.upsertAnmModel.controls.modelConfigName.value !== '') {
      this.modelConfigTempName = this.modelConfigTempName;
    }
    const selectDataSet = this.datasets && this.datasets.length && this.datasets.length > 0 ? this.datasets[0] : '';
    const selectEncoder = this.encoders && this.encoders.length && this.encoders.length > 0 ? this.encoders[0] : '';
    const selectScaler = this.scalers && this.scalers.length && this.scalers.length > 0 ? this.scalers[0] : '';
    const selectOptimizers = this.optimizers && this.optimizers.length && this.optimizers.length > 0 ? this.optimizers[0] : '';
    const selectActivations = this.activations && this.activations.length && this.activations.length > 0 ? this.activations[0] : '';
    const selectDecoderActivations = this.decoder_Activations
      && this.decoder_Activations.length && this.decoder_Activations.length > 0 ? this.decoder_Activations[0] : '';
    const selectUniqueFeatures = this.uniqueFeatures
      && this.uniqueFeatures.length && this.uniqueFeatures.length > 0 ? this.uniqueFeatures[0] : '';
    const selectLosses = this.losses && this.losses.length && this.losses.length > 0 ? this.losses[0] : '';
    if (this.modelTypes[0] === modelType) {
      this.upsertAnmModel = this.formBuilder.group({
        id: '',
        modelConfigName: [this.modelConfigTempName, Validators.required],
        modelType: [modelType, Validators.required],
        encoder: [selectEncoder, Validators.required],
        scaler: [selectScaler, Validators.required],
        optimizer: [selectOptimizers, Validators.required],
        activation: [selectActivations, Validators.required],
        decoder_activation: [selectDecoderActivations, Validators.required],
        dropout: ['', Validators.required],
        l1L2: ['', Validators.required],
        batchSize: ['', Validators.required],
        metrics: [this.metrics[0], Validators.required],
        nodes: [[], Validators.required],
        dataSetName: [selectDataSet, Validators.required],
        trainingFilter: '',
        xfeatureList: '',
        uniqueFeature: [selectUniqueFeatures, Validators.required],
        stringFeatures: '',
        loss: [this.losses[0], Validators.required],
        epochs: ['', Validators.required],
        p_components: ''
      });

    } else if (this.modelTypes[1] === modelType) {
      this.upsertAnmModel = this.formBuilder.group({
        id: '',
        modelConfigName: [this.modelConfigTempName, Validators.required],
        modelType: [modelType, Validators.required],
        encoder: [selectEncoder, Validators.required],
        scaler: [selectScaler, Validators.required],
        loss: [selectLosses, Validators.required],
        epochs: '',
        p_components: ['', Validators.required],
        dataSetName: [selectDataSet, Validators.required],
        trainingFilter: '',
        xfeatureList: '',
        uniqueFeature: [selectUniqueFeatures, Validators.required],
        stringFeatures: '',
        optimizer: '',
        activation: '',
        decoder_activation: '',
        dropout: '',
        l1L2: '',
        batchSize: '',
        metrics: '',
        nodes: []
      });

    }
    this.setFormControls({ value: modelType });
  }
  setFormControls(event, anyAction?) {
    const modelType = event.value;
    if (anyAction) {
      this.nodeList = [];
      this.getMasterData(modelType);
    }

    if (modelType === 'MODELI') {
      this.upsertAnmModel.controls.optimizer.enable();
      this.upsertAnmModel.controls.activation.enable();
      this.upsertAnmModel.controls.decoder_activation.enable();
      this.upsertAnmModel.controls.dropout.enable();
      this.upsertAnmModel.controls.l1L2.enable();
      this.upsertAnmModel.controls.batchSize.enable();
      this.upsertAnmModel.controls.metrics.enable();
      this.upsertAnmModel.controls.nodes.enable();

      this.upsertAnmModel.controls.epochs.enable();
      this.upsertAnmModel.controls.p_components.disable();
    } else if (modelType === 'MODELII') {

      this.upsertAnmModel.controls.optimizer.disable();
      this.upsertAnmModel.controls.activation.disable();
      this.upsertAnmModel.controls.decoder_activation.disable();
      this.upsertAnmModel.controls.dropout.disable();
      this.upsertAnmModel.controls.l1L2.disable();
      this.upsertAnmModel.controls.batchSize.disable();
      this.upsertAnmModel.controls.metrics.disable();
      this.upsertAnmModel.controls.nodes.disable();
      this.upsertAnmModel.controls.epochs.disable();

      this.upsertAnmModel.controls.p_components.enable();
    }

  }
  setDataSetUniqueFeatures(dataSetName, model?, modelType?) {
    this.xfeatures = [];
    this.tfeatures = [];
    this.sfeatures = [];
    this.uniqueFeatures = [];
    this.selectAll = false;
    this.uniqueselectAll = false;
    this.stringselectAll = false;
    const data = { dataSetName };
    this.anomalyService.getAnomalyDataSetFeatures(data).subscribe((res: any) => {
      this.isActionTaken = false;
      if (res.status === 'success') {
        const resData = res.data && res.data.data ? res.data.data : null;
        const fetaureListMap = resData && resData.featureMapping && resData.featureMapping.length ?
          resData.featureMapping.map(it => it.feature) : [];
        this.uniqueFeatures = [...fetaureListMap];
        const features = this.createFeatureList(this.uniqueFeatures);
        this.xfeatures = features;
        this.sfeatures = features;
        this.tfeatures = features;
        if (model && modelType) {
          this.setInitialDataToForm(model, modelType);
        } else if (modelType) {
          this.createForm(modelType);
        } else {
          this.upsertAnmModel.controls.uniqueFeature.setValue(this.uniqueFeatures[0]);
        }
      } else {
        this.xfeatures = [];
        this.sfeatures = [];
        this.tfeatures = [];
        this.uniqueFeatures = [];
        if (model && modelType) {
          this.setInitialDataToForm(model, modelType);
        } else if (modelType) {
          this.createForm(modelType);
        } else {
          this.upsertAnmModel.controls.uniqueFeature.setValue('');
        }
      }
    }, (error) => {
      this.isActionTaken = false;
      this.xfeatures = [];
      this.sfeatures = [];
      this.tfeatures = [];
      this.uniqueFeatures = [];
      if (model && modelType) {
        this.setInitialDataToForm(model, modelType);
      } else if (modelType) {
        this.createForm(modelType);
      } else {
        this.upsertAnmModel.controls.uniqueFeature.setValue('');
      }
      this.showToastrinfo('Alert', 'Server error occured');
    });
  }
  setInitialData(model, modelType) {
    this.setDataSetUniqueFeatures(model.dataSetName, model, modelType);
  }
  setInitialDataToForm(model, modelType) {
    this.setFormControls({ value: modelType });
    this.upsertAnmModel.controls.id.setValue(model.id);
    this.upsertAnmModel.controls.modelConfigName.setValue(model.modelConfigName);
    this.upsertAnmModel.controls.modelType.setValue(modelType);
    this.upsertAnmModel.controls.encoder.setValue(model.encoder);
    this.upsertAnmModel.controls.scaler.setValue(model.scaler);
    this.upsertAnmModel.controls.dataSetName.setValue(model.dataSetName);
    this.upsertAnmModel.controls.uniqueFeature.setValue(model.uniqueFeature);
    this.upsertAnmModel.controls.loss.setValue(model.loss);
    this.setAllFeatures(model);
    if (modelType === 'MODELI') {
      this.upsertAnmModel.controls.optimizer.setValue(model.optimizer);
      this.upsertAnmModel.controls.activation.setValue(model.activation);
      this.upsertAnmModel.controls.decoder_activation.setValue(model.decoder_activation);
      this.upsertAnmModel.controls.dropout.setValue(model.dropout);
      this.upsertAnmModel.controls.l1L2.setValue(model.l1L2[0] + ', ' + model.l1L2[1]);
      this.upsertAnmModel.controls.batchSize.setValue(model.batchSize);
      this.upsertAnmModel.controls.metrics.setValue(model.metrics[0]);
      this.upsertAnmModel.controls.nodes.setValue(model.nodes);
      this.upsertAnmModel.controls.epochs.setValue(model.epochs);
      this.nodeList = model.nodes;
      this.nodeListLength = this.upsertAnmModel.controls.nodes.value.length;


    } else if (modelType === 'MODELII') {
      this.upsertAnmModel.controls.p_components.setValue(model.p_components);
    }
  }
  setAllFeatures(model) {
    this.setXFeature(model);
    this.setTrainingFilter(model);
    this.setSFeature(model);
    this.isAllChecked();
  }
  setXFeature(model) {
    model.xfeatureList.forEach(selData => {
      this.xfeatures.forEach(el => {
        if (el.name === selData) {
          el.checkXData = true;
        }
      });
    });

  }
  setTrainingFilter(model) {
    model.trainingFilter.forEach(selData => {
      this.tfeatures.forEach(el => {
        if (el.name === selData) {
          el.checkTrainData = true;
        }
      });
    });
  }
  setSFeature(model) {
    model.stringFeatures.forEach(selData => {
      this.sfeatures.forEach(el => {
        if (el.name === selData) {
          el.checkStringData = true;
        }
      });
    });
  }
  removeNodes() {
    if (this.nodeList.length > 0) {
      this.nodeList.splice(this.nodeList.length - 1, 1);
    }
    this.upsertAnmModel.controls.nodes.setValue([]);
    this.upsertAnmModel.controls.nodes.setValue(this.nodeList);
    this.nodeListLength = this.upsertAnmModel.controls.nodes.value.length;
  }
  addNodes() {
    this.nodeList.push('0');
    this.upsertAnmModel.controls.nodes.setValue([]);
    this.upsertAnmModel.controls.nodes.setValue(this.nodeList);
    this.nodeListLength = this.upsertAnmModel.controls.nodes.value.length;
  }
  setValue(event, i) {
    this.isNodeValueChanged = true;
    setTimeout(() => {
      this.isNodeValueChanged = false;
    }, 0);
    this.nodeList[i] = event.currentTarget.value;
    this.upsertAnmModel.controls.nodes.setValue(this.nodeList);


  }
  clearfeatures() {
    this.xfeatures = [];
    this.tfeatures = [];
    this.sfeatures = [];
    this.uniqueFeatures = [];
    this.isAllChecked();
    this.uniqueisAllChecked();
    this.isAllCheckedstring();
  }
  saveAnmModelData() {
    // tslint:disable-next-line:prefer-const
    let modelData = this.upsertAnmModel.value;
    this.isAnySelected();
    if (this.isActionTaken) {
      this.global.opendisplayModal('Please provide some changes to save the data', 'OK', 'Alert');
    } else if ( this.upsertAnmModel.controls.modelType.value === 'MODELI' && modelData.nodes.includes('0')) {
      this.global.opendisplayModal('Node Value should be greater than 0', 'OK', 'Alert');
    } else if (!this.upsertAnmModel.valid) {
      this.global.opendisplayModal('Please provide all the model details', 'OK', 'Alert');
    } else if ( this.upsertAnmModel.controls.modelType.value === 'MODELI' &&
    modelData.dropout && (modelData.dropout < 0 || modelData.dropout > 1)) {
      this.global.opendisplayModal('Drop Out value should be between 0 and 1', 'OK', 'Alert');
    } else if (this.upsertAnmModel.controls.modelType.value === 'MODELI' &&
    modelData.l1L2 && !this.maskL1l2Numregex.test(modelData.l1L2)) {
      // tslint:disable-next-line:max-line-length
      this.global.opendisplayModal('L1, L2 value should be in format 0.0, 0.0 and should be in the range (0.0 - 1.0), (0.0 - 1.0)', 'OK', 'Alert');
    } else if (!this.isXfeaturesSelected) {
      this.global.opendisplayModal('Please Select Features and Filters', 'OK', 'Alert');
    } else if (!this.leastOneAlpha.test(modelData.modelConfigName)) {
      this.global.opendisplayModal('Configuration Name provided should have atleast 1 character(A-Z)', 'OK', 'Alert');
    } else {
      this.isActionTaken = true;
      modelData.xfeatureList = [];
      modelData.trainingFilter = [];
      modelData.stringFeatures = [];
      this.sfeatures.forEach(x => {


        if (x.checkStringData) {
          modelData.stringFeatures.push(x.name);
        }

      });
      this.xfeatures.forEach(x => {
        if (x.checkXData) {
          modelData.xfeatureList.push(x.name);
        }



      });
      this.tfeatures.forEach(x => {

        if (x.checkTrainData) {
          modelData.trainingFilter.push(x.name);
        }


      });
      modelData.jobType = 'TRAINING';
      modelData.modelConfigCount = 0;
      // tslint:disable-next-line:prefer-const
      let data = { modelType: 'none', modelConfig: {} };
      if (this.upsertAnmModel.controls.modelType.value === 'MODELI') {
        const l1 = modelData.l1L2.split(',')[0];
        let l2 = modelData.l1L2.split(',')[1];
        l2 = l2.trim();
        modelData.l1L2 = [l1, l2];
        modelData.metrics = [modelData.metrics];
        data.modelConfig = {
          anomalyI: modelData,
          anomalyII: null
        };
        data.modelType = 'MODELI';
      } else if (this.upsertAnmModel.controls.modelType.value === 'MODELII') {
        modelData.p_components = modelData.p_components;
        data.modelConfig = {
          anomalyII: modelData,
          anomalyI: null
        };
        data.modelType = 'MODELII';
      }

      if (this.action === 'Update') {
        this.anomalyService.updateAnmModel(data).subscribe((res: any) => {
          this.isActionTaken = false;
          if (res.status === 'success') {
            if (res.data && res.data.responseType && res.data.responseType === 'ERR') {
              this.notfyService.showToastrWarning('Alert', res.data.reponseMessage);
            } else {
              this.showToastrSuccess('Success', 'Anomaly Model Updated');
              this.anomalyNavigation(this.modelConfigPath);
            }
          }
        }, (error) => {
          this.isActionTaken = false;
          this.showToastrinfo('Alert', 'Server error occured');
        });
      } else if (this.action === 'Create') {
        this.anomalyService.createAnmModel(data).subscribe((res: any) => {
          this.isActionTaken = false;
          if (res.status === 'success') {
            if (res.data && res.data.responseType && res.data.responseType === 'ERR') {
              this.notfyService.showToastrWarning('Alert', res.data.reponseMessage);
            } else {
              this.showToastrSuccess('Success', 'Anomaly Model Creation');
              this.anomalyNavigation(this.modelConfigPath);
            }
          }
        }, (error) => {
          this.isActionTaken = false;
          this.showToastrinfo('Alert', 'Server error occured');
        });
      }
    }
  }

  getCallData(id, index) {

  }
  getMasterData(modelType?) {
    const data = {
      modelType: this.action === 'Update' ?
        this.anomalyService.AnomalymodelType : (modelType ? modelType : this.modelTypes[0])
    };

    if (this.masterData && this.masterData !== null) {
      this.setInitialMasterData(data.modelType);
    } else {
      this.masterDataLoading = true;
      const JobType = { jobType: 'ANOMALY DETECTION' };
      this.anomalyService.loadAnmMdConfigMasterData(data, JobType).subscribe((res: any) => {
        this.masterDataLoading = false;
        this.masterDataLoadingSuccess = true;
        if (res[1].status === 'success') {
          this.datasets = res[1].data && res[1].data.data ? res[1].data.data : [];
        }
        if (res[0].status === 'success') {
          this.masterData = res[0].data[0];
          this.setInitialMasterData(data.modelType);
        }

      }, (error) => {
        this.masterDataLoading = false;
        this.masterDataLoadingSuccess = false;
      });
    }

  }
  setInitialMasterData(modelType) {
    if (this.modelTypes[0] === modelType) {
      if (this.masterData.anomalyI && this.masterData.anomalyI !== null) {
        this.encoders = this.masterData.anomalyI.encoders ? this.masterData.anomalyI.encoders : [];
        this.scalers = this.masterData.anomalyI.scalers ? this.masterData.anomalyI.scalers : [];
        this.losses = this.masterData.anomalyI.losses ? this.masterData.anomalyI.losses : [];
        this.optimizers = this.masterData.anomalyI.optimizers ? this.masterData.anomalyI.optimizers : [];
        this.activations = this.masterData.anomalyI.activations ? this.masterData.anomalyI.activations : [];
        this.decoder_Activations = this.masterData.anomalyI.decoder_Activations ? this.masterData.anomalyI.decoder_Activations : [];
        this.metrics = this.masterData.anomalyI.metrics ? this.masterData.anomalyI.metrics : [];
        // this.masterDataSetNames = this.masterData.anomalyI.datasetName;
        // this.datasets = Object.keys(this.masterData.anomalyI.datasetName).map((key) => key);
      }
    } else if (this.modelTypes[1] === modelType) {
      if (this.masterData.anomalyII && this.masterData.anomalyII !== null) {
        this.encoders = this.masterData.anomalyII.encoders ? this.masterData.anomalyII.encoders : [];
        this.scalers = this.masterData.anomalyII.scalers ? this.masterData.anomalyII.scalers : [];
        this.losses = this.masterData.anomalyII.losses ? this.masterData.anomalyII.losses : [];
        // this.masterDataSetNames = this.masterData.anomalyII.datasetName;
        // this.datasets = Object.keys(this.masterData.anomalyII.datasetName).map((key) => key);
      }
    }
    if (this.action === 'Update') {
      this.getModelConfigDetails({
        modelType: this.anomalyService.AnomalymodelType,
        modelConfigName: this.anomalyService.AnomalymodelName
      });

    } else {
      this.setDataSetUniqueFeatures(this.datasets[0], undefined, modelType);
    }
  }
  createFeatureList(data) {
    return data && data.length > 0 ? data.map(it => ({ checkXData: false, checkStringData: false, checkTrainData: false, name: it })) : [];
  }
  checkAlls(value) {
    this.xfeatures.forEach(x => x.checkXData = value);
  }
  clearAllSelection(opt) {
    switch (opt) {
      case 1:
        this.xfeatures.forEach(x => x.checkXData = false);
        this.isAllChecked();
        break;
      case 2:
        this.tfeatures.forEach(x => x.checkTrainData = false);
        this.uniqueisAllChecked();
        break;
      case 3:
        this.sfeatures.forEach(x => x.checkStringData = false);
        this.isAllCheckedstring();
        break;
    }
  }
  isAllChecked() {
    if (this.xfeatures.length === 0) {
      this.selectAll = false;
    } else {
      this.selectAll = this.xfeatures.every(_ => _.checkXData);
    }
  }
  checkAllunique(value) {
    this.tfeatures.forEach(x => x.checkTrainData = value);
  }
  isAnySelected() {
    this.isXfeaturesSelected = this.xfeatures.find(x => x.checkXData);
    this.isTrainingFilterSeleceted = this.tfeatures.find(x => x.checkTrainData);
    this.isStringFeatureSelected = this.sfeatures.find(x => x.checkStringData);
  }
  uniqueisAllChecked() {
    if (this.tfeatures.length === 0) {
      this.uniqueselectAll = false;
    } else {
      this.uniqueselectAll = this.tfeatures.every(_ => _.checkTrainData);
    }
  }
  checkAllselected(elval) {
    this.sfeatures.forEach(x => x.checkStringData = elval);
  }
  isAllCheckedstring() {
    if (this.sfeatures.length === 0) {
      this.stringselectAll = false;
    } else {
      this.stringselectAll = this.sfeatures.every(_ => _.checkStringData);
    }
  }

  // checkItem(event,item) {
  //  item.checkboxdata = !item.checkboxdata;
  // }

  /*************************************Sumit Code Starts********* */

  // on search
  onsearchChange(searchVal, featureNo) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    // switch (featureNo) {
    //   case 1:
    //     const fetx = this.uniqueFeatures.filter((el) => el.includes(searchVal));
    //     this.xfeatures = this.createFeatureList(fetx);
    //     break;
    //   case 1:
    //     const fett = this.uniqueFeatures.filter((el) => el.includes(searchVal));
    //     this.tfeatures = this.createFeatureList(fett);
    //     break;
    //   case 1:
    //     const fets = this.uniqueFeatures.filter((el) => el.includes(searchVal));
    //     this.sfeatures = this.createFeatureList(fets);
    //     break;
    // }
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
    } else {
      this.config.currentPage = inputVal;
    }
  }
  onFeatureTabChanged(evt) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    this.itemPerPage = this.defauultItempg;
    if (evt.index === 0) {
      this.searchFilterX = '';
    } else if (evt.index === 1) {
      this.searchFilterT = '';
    } else if (evt.index === 2) {
      this.searchFilterS = '';
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
    this.key = key;
    this.reverse = !this.reverse;
  }

  showToastrSuccess(headText, msg) {
    this.toastr.success(msg, headText, {
      timeOut: 2500,
      positionClass: 'toast-bottom-right',
    });
  }

  // Info
  showToastrinfo(headText, msg) {
    this.toastr.info(msg, headText, {
      timeOut: 2500,
      positionClass: 'toast-bottom-right',
    });
  }

  anomalyNavigation(navigationpath, newConfig?) {
    this.router.navigate([navigationpath]);
  }

  getModelConfigDetails(modelConfObj) {
    if (modelConfObj && modelConfObj.modelConfigName) {
      this.detailLoader = true;
      const body = { modelType: modelConfObj.modelType, modelConfigName: modelConfObj.modelConfigName };
      this.anomalyService.getAnmolayModelConfigByName(body).subscribe((res: any) => {
        this.detailLoader = false;
        if (res && res.status === 'success' && res.data && Object.keys(res.data).length > 0) {
          this.modelconfI = res.data.anomalyI && Object.keys(res.data.anomalyI).length > 0 ? res.data.anomalyI : null;
          this.modelconfII = res.data.anomalyII && Object.keys(res.data.anomalyII).length > 0 ? res.data.anomalyII : null;
          if (this.modelconfI !== null) {
            this.setInitialData(this.modelconfI, 'MODELI');
          } else if (this.modelconfII !== null) {
            this.setInitialData(this.modelconfII, 'MODELII');
          }
        } else {
          this.showToastrinfo('Alert', 'Exception occured');
          this.detailLoader = false;
        }
      }, err => {
        this.detailLoader = false;
        this.showToastrinfo('Alert', 'Server error occured');
      });
    } else {
    }
  }


  ngOnDestroy() {
    this.anomalyService.AnomalyModel = false;
    this.anomalyService.AnomalyUpdateModel = false;
  }

}
