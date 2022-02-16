from django.urls import path
from django.contrib import admin
from django.conf.urls import url, include
from katana.wapps.vax import views

#from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', views.HomePageView.as_view()),
    path('datamanagement/', views.HomePageView.as_view()),
    path('datamanagement/upsertdataset/', views.HomePageView.as_view()),
    path('datamanagement/upsertdatasource/', views.HomePageView.as_view()),
    path('datamanagement/datasource/', views.HomePageView.as_view()),
    path('datamanagement/configuration/', views.HomePageView.as_view()),
     path('datamanagement/datapreviewdm/', views.HomePageView.as_view()),
    path('datamanagement/upsertconfiguration/', views.HomePageView.as_view()),
    path('getJobTypeList/',views.getJobTypeList,name='getJobTypeList'),
    path('getPropertyTypeList/',views.getPropertyTypeList,name='getPropertyTypeList'),
    path('getDataPreviewDetails/',views.getDataPreviewDetails,name='getDataPreviewDetails'),
    path('getConfigurationList/',views.getConfigurationList,name='getConfigurationList'),
    path('getConfigurationDet/',views.getConfigurationDet,name='getConfigurationDet'),
    path('getStepsDetails/',views.getStepsDetails,name='getStepsDetails'),
    path('getFeatureDet/',views.getFeatureDet,name='getFeatureDet'),
    path('createDataSet/',views.createDataSet,name='createDataSet'),
    path('updateDataSet/',views.updateDataSet,name='updateDataSet'),
    path('fileUploadDataSet/',views.fileUploadDataSet,name='fileUploadDataSet'),
    path('streamDataSchedule/',views.streamDataSchedule,name='streamDataSchedule'),
    path('getStreamScheduleStatus/',views.getStreamScheduleStatus,name='getStreamScheduleStatus'),
    path('getConfigurationTableview/',views.getConfigurationTableview,name='getConfigurationTableview'),
    path('getConfigurationDetailedView/',views.getConfigurationDetailedView,name='getConfigurationDetailedView'),
    path('getConfigurationDBType/',views.getConfigurationDBType,name='getConfigurationDBType'),
    path('createConfiguration/',views.createConfiguration,name='createConfiguration'),
    path('createNewDBType/',views.createNewDBType,name='createNewDBType'),
    path('getDataSourceList/',views.getDataSourceList,name='getDataSourceList'),
    path('getDataSource/',views.getDataSource,name='getDataSource'),
    path('deleteDataSource/',views.deleteDataSource,name='deleteDataSource'),
    path('deleteConfiguration/',views.deleteConfiguration,name='deleteConfiguration'),
    path('updateConfiguration/',views.updateConfiguration,name='updateConfiguration'),
    path('getDataSetForJobType/',views.getDataSetForJobType,name='getDataSetForJobType'),
    path('getSummaryDetails/',views.getSummaryDetails,name='getSummaryDetails')
]
