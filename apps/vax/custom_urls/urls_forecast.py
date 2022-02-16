from django.urls import path
from django.contrib import admin
from django.conf.urls import url, include
from katana.wapps.vax import views

#from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('', views.HomePageView.as_view()),
    path('forecast/', views.HomePageView.as_view()),
    path('forecast/forecastselect/', views.HomePageView.as_view()),
    path('forecast/forecastprocess/', views.HomePageView.as_view()),
    path('forecast/forecastprocess/forecastcompare/', views.HomePageView.as_view()),
    path('forecast/forecastprocess/modelconfig/', views.HomePageView.as_view()),
    path('forecast/forecastselect/modelconfig/', views.HomePageView.as_view()),
    path('forecast/forecastprocess/modelconfig/updateconfig/', views.HomePageView.as_view()),
    path('forecast/forecastselect/modelconfig/updateconfig/', views.HomePageView.as_view()),
    path('getAllModelConfigs/',views.getAllModelConfigs,name='getAllModelConfigs'),
    path('ForeCastmodelConfig', views.getModalconfigTimeseries, name='getModalconfigTimeseries'),
    path('getModelConfigDetails/',views.getModelConfigDetails,name='getModelConfigDetails'),
    path('updateForecastSelection/',views.updateForecastSelection,name='updateForecastSelection'),
    path('saveForecastSelection/',views.saveForecastSelection,name='saveForecastSelection'),
    path('handleForecastProcessing/',views.handleForecastProcessing,name='handleForecastProcessing'),
    path('createModelConfiguration',views.createModelConfiguration,name='createModelConfiguration'),
    path('updateModelConfiguration',views.updateModelConfiguration,name='updateModelConfiguration'),
    path('forecastdeleteModelConfig',views.deleteModelConfiguration,name='deleteModelConfiguration'),
    path('ForecastSelectiontable/',views.getForecastSelection,name='getForecastSelection'),
    path('forecastProcessingtable/',views.getForecastProcessing,name='getForecastProcessing'),
    path('forecastProcessingModelDetails/',views.forecastProcessingModelDetails,name='forecastProcessingModelDetails'),
    path('ForecastSelectionUpdatetable',views.updateForecastSelectiontable,name='updateForecastSelectiontable'),
    path('configurationModelConfig',views.configurationModelConfig,name='configurationModelConfig'),
    path('Datasetname',views.getDatasetname,name='getDatasetname'),
    path('scheduleForecastSelection',views.scheduleForecastSelection,name='scheduleForecastSelection'),
    path('getForecastCompare',views.getForecastCompare,name='getForecastCompare'),

]
