from django.urls import path
from django.contrib import admin
from django.conf.urls import url, include
from katana.wapps.vax import views

urlpatterns = [
    path('createTask/',views.createTask,name='createTask'),
    path('updateTask/',views.updateTask,name='updateTask'),
    path('getalltaskDetails/',views.getalltaskDetails,name='getalltaskDetails'),
    path('actionOnTask/',views.actionOnTask,name='actionOnTask'),
    path('getScheduleDetails/',views.getScheduleDetails,name='getScheduleDetails'),
    path('socketUrls/',views.socketUrls,name='socketUrls'),
    path('getalltask/',views.getalltask,name='getalltask')
]
