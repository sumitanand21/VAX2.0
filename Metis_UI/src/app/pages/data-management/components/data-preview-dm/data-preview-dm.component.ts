import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { DataManagementService } from '../../services/data-management.service';

@Component({
  selector: 'app-data-preview-dm',
  templateUrl: './data-preview-dm.component.html',
  styleUrls: ['./data-preview-dm.component.css']
})
export class DataPreviewDMComponent implements OnInit, OnDestroy {
  previewLoader = false;
  dataSetName = '';
  defaultCurrentPage = 1;
  defaultItempg = 25;
  itemPerPage = this.defaultItempg;
  inputCurrentpage = this.defaultCurrentPage;
  searchFilter = '';
  pageArr = [25, 50, 100];
  config = {
    id: 'configTable',
    itemsPerPage: this.defaultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  key = 'name';
  reverse = false;

  tempFeatureDetails = [
    { featureName: 'Feature 1', fetureCount: [1, 0, 4, 5] },
    { featureName: 'Feature 2', fetureCount: [1, 0, 5] },
    { featureName: 'Feature 3', fetureCount: [1, 0, 7, 5] },
    { featureName: 'Feature 4', fetureCount: [1, 4, 5] },
    { featureName: 'Feature 5', fetureCount: [1, 0, 7, 5] },
    { featureName: 'Feature 6', fetureCount: [1, 0, 4, 5] },
    { featureName: 'Feature 7', fetureCount: [1, 4, 5] },
    { featureName: 'Feature 8', fetureCount: [1, 0, 4, 5] },
    { featureName: 'Feature 9', fetureCount: [1, 0, 4] },
    { featureName: 'Feature 10', fetureCount: [0, 4, 5] }
  ];

  featureName = [];
  featureDeatils = [];

  constructor(public dataManagementService: DataManagementService,
              private router: Router,
              public notify: NotificationService) { }

  ngOnInit() {
    this.dataManagementService.showDataPreview = true;
    if (this.dataManagementService.selectedDataSetName) {
      this.dataSetName = this.dataManagementService.selectedDataSetName;
      this.getdataPreviewDetails();
    } else {
      this.router.navigate(['/datamanagement/datasource']);
    }
  }

  getdataPreviewDetails() {
    this.previewLoader = true;
    const data = { dataSetName: this.dataSetName };
    this.dataManagementService.getDataPreview(data).subscribe((res: any) => {
      this.previewLoader = false;
      if (res.status === 'success') {
        const dataObjectArr = res.data && res.data.data && res.data.data.length > 0 ? res.data.data : [];
        const featureObj = this.createFeatureObj(dataObjectArr);
        this.featureName = featureObj.featureNameArr;
        this.featureDeatils = featureObj.fetaureDetArr;
      } else {
        this.featureName = [];
        this.featureDeatils = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch data preview');
        this.previewLoader = false;
      }
    },
      err => {
        this.previewLoader = false;
        this.featureName = [];
        this.featureDeatils = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch data preview');
      });
  }

  // createFeatureObj() {
  //   const fetureArr = [];
  //   const featureDetailsArr = [];
  //   for (let i = 1; i < 100; i++) {
  //     const featureDetObj = {};
  //     for (let j = 1; j < 15; j++) {
  //       const featureKeyVal = 'Feature' + j;
  //       const featureObj = { featureName: 'Feature ' + j, fetureKey: featureKeyVal };
  //       featureDetObj[featureKeyVal] = Math.floor((Math.random() * 100) + 1);
  //       if (i === 1) {
  //         fetureArr.push(Object.assign({}, featureObj));
  //       }
  //     }
  //     featureDetailsArr.push(Object.assign({}, featureDetObj));

  //   }
  //   return { featureNameArr: fetureArr, fetaureDetArr: featureDetailsArr };
  // }

  createFeatureObj(dataObjectArr) {
    const fetureArr = [];
    const featureDetailsArr = [...dataObjectArr];
    if (dataObjectArr.length > 0) {
      const featureDetObj = Object.assign({}, dataObjectArr[0]);
      Object.keys(featureDetObj).forEach(it => {
        const featureObj = { featureName: it, fetureKey: it };
        fetureArr.push(Object.assign({}, featureObj));
      });
    }
    return { featureNameArr: fetureArr, fetaureDetArr: featureDetailsArr };
  }

  sort(key) {
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
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


  ngOnDestroy() {
    this.dataManagementService.showDataPreview = false;
  }




}

