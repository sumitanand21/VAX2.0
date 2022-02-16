from django.urls import path
from django.contrib import admin
from django.conf.urls import url, include
from katana.wapps.vax import views

urlpatterns = [
    path('correlation/', views.HomePageView.as_view()),
    path('correlation/heatmap/', views.HomePageView.as_view()),
    path('correlation/tableview/', views.HomePageView.as_view()),
    path('correlation/correlatedgroups/', views.HomePageView.as_view()),
    path('correlation/upsertfeature/', views.HomePageView.as_view()),
    path('correlation/featuregroup/', views.HomePageView.as_view()),
    path('correlation/correlatedgroupsview/', views.HomePageView.as_view()),
    path('getCorrelationDataSets/',views.getCorrelationDataSets,name='getCorrelationDataSets'),
    path('getCorrelationGroups/',views.getCorrelationGroups,name='getCorrelationGroups'),
    path('getCorrelationDataSetMappings/',views.getCorrelationDataSetMappings,name='getCorrelationDataSetMappings'),
    path('getCorrelationTimeColumns/',views.getCorrelationTimeColumns,name='getCorrelationTimeColumns'),
    path('getFeatureGroupDetails/',views.getFeatureGroupDetails,name='getFeatureGroupDetails'),
    path('updateFeatureGroup/',views.updateFeatureGroup,name='updateFeatureGroup'),
    path('getCorrelationTableViewData/', views.getCorrelationTableViewData,name='getCorrelationTableViewData'),
    path('getcorrelationheatmap/',views.getcorrelationheatmap,name='getcorrelationheatmap'),
    path('getcorrelationplotdata/',views.getcorrelationplotdata,name='getcorrelationplotdata'),
    path('getpartionedchartdata/',views.getpartionedchartdata,name='getpartionedchartdata'),
    path('getcorrelationlistdata/',views.getcorrelationlistdata,name='getcorrelationlistdata'),
    path('getNegativeGroups/',views.getNegativeGroups,name='getNegativeGroups'),
    path('getPositiveGroups/',views.getPositiveGroups,name='getPositiveGroups'),
    path('getGroupDetails/',views.getGroupDetails,name='getGroupDetails'),
    path('deleteFeatureGroup/',views.deleteFeatureGroup,name='deleteFeatureGroup')
]
