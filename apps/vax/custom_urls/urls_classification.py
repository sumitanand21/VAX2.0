from django.urls import path
from django.contrib import admin
from django.conf.urls import url, include
from katana.wapps.vax import views

#from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('classification/', views.HomePageView.as_view()),
    path('classification/profiler/', views.HomePageView.as_view()),
    path('classification/profilerupsertfeature/', views.HomePageView.as_view()),
    path('getClassificationDataSets/',views.getClassificationDataSets,name='getClassificationDataSets'),
    path('getClassificationGroups/',views.getClassificationGroups,name='getClassificationGroups'),
    path('getClassificationDataSetMappings/',views.getClassificationDataSetMappings,name='getClassificationDataSetMappings'),
    path('getClassificationTimeColumns/',views.getClassificationTimeColumns,name='getClassificationTimeColumns'),
    path('getClassificationFeatureGroupDetails/',views.getClassificationFeatureGroupDetails,name='getClassificationFeatureGroupDetails'),
    path('updateClassificationFeatureGroup/',views.updateClassificationFeatureGroup,name='updateClassificationFeatureGroup'),
    path('scheduleProfiler/',views.scheduleProfiler,name='scheduleProfiler'),
    path('createClassificationFeatureGroup/',views.createClassificationFeatureGroup,name='createClassificationFeatureGroup'),
    path('getProfilerResult/',views.getProfilerResult,name='getProfilerResult'),
    path('deleteClassificationFeatureGroup/',views.deleteClassificationFeatureGroup,name='deleteClassificationFeatureGroup')
]
