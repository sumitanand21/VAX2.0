from django.urls import path
from django.contrib import admin
from django.conf.urls import url, include
from katana.wapps.vax import views

#from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('anomaly/', views.HomePageView.as_view()),
    path('summary/', views.HomePageView.as_view()),
    path('anomaly/anomalydetection/', views.HomePageView.as_view()),
    path('anomaly/anomalyview/', views.HomePageView.as_view()),
    path('anomaly/alltask/', views.HomePageView.as_view()),
    path('anomaly/anomalydetection/anomalymodelconfig/', views.HomePageView.as_view()),
    path('anomaly/anomalyview/anomalymodelconfig/', views.HomePageView.as_view()),
    path('anomaly/alltask/anomalymodelconfig/', views.HomePageView.as_view()),
    path('anomaly/anomalydetection/anomalymodelconfig/upsertmodelconfig/', views.HomePageView.as_view()),
    path('anomaly/anomalyview/anomalymodelconfig/upsertmodelconfig/', views.HomePageView.as_view()),
    path('anomaly/alltask/anomalymodelconfig/upsertmodelconfig/', views.HomePageView.as_view()),
    path('anomaly/alltask/modeltraining/', views.HomePageView.as_view()),
    path('getAnmMdConfigurations/',views.getAnmMdConfigurations,name='getAnmMdConfigurations'),
    path('updateAnmMdConfig/',views.updateAnmMdConfig,name='updateAnmMdConfig'),
    path('createAnmMdConfig/',views.createAnmMdConfig,name='createAnmMdConfig'),
    path('getAllAnmModels/',views.getAllAnmModels,name='getAllAnmModels'),
    path('getAnmModelDetails/',views.getAnmModelDetails,name='getAnmModelDetails'),
    path('getAnomalyModelConfigs/',views.getAllAnmModelConfigs,name='getAllAnmModelConfigs'),
    path('getAnomalyModelConfigUsingName/',views.getModelConfigUsingName,name='getModelConfigUsingName'),
    path('deleteAnomalyModel/',views.deleteAnomalyModelConfiguration,name='deleteAnomalyModelConfiguration'),
    path('getTrainingDetails/',views.getTrainingDetails,name='getTrainingDetails'),
    path('getTrainedModels/',views.getTrainedModels,name='getTrainedModels'),
    path('getAllAnmdTrainedModels/',views.getAllAnmdTrainedModels,name='getAllAnmdTrainedModels'),
    path('getTrainingStatus/',views.getTrainingStatus,name='getTrainingStatus'),
    path('deleteTrainedModels/',views.deleteTrainedModels,name='deleteTrainedModels'),
    path('getTrainingResultData/',views.getTrainingResultData,name='getTrainingResultData'),
    path('getTrainingResultAnomalyDetData/',views.getTrainingResultAnomalyDetData,name='getTrainingResultAnomalyDetData'),
    path('getAnomalyDataSets/',views.getAnomalyDataSets,name='getAnomalyDataSets'),
    path('getAnomalyDataSetFeatures/',views.getAnomalyDataSetFeatures,name='getAnomalyDataSetFeatures'),
    path('scheduleAnmdDetect/',views.scheduleAnmdDetect,name='scheduleAnmdDetect'),
    path('scheduleAnmlProfiling/',views.scheduleAnmlProfiling,name='scheduleAnmlProfiling'),
    path('anmlProfilingResult/',views.anmlProfilingResult,name='anmlProfilingResult'),
    path('stopTrainingModel/',views.stopTrainingModel,name='stopTrainingModel'),
    path('stopAnomalyDetection/',views.stopAnomalyDetection,name='stopAnomalyDetection')
]
