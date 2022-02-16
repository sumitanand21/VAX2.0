from django.shortcuts import render
import requests
from requests.auth import HTTPBasicAuth
from django.http import HttpResponse,JsonResponse
from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt
import json
import ast
import configparser
CONFIG_FILE = "/etc/config/warrior_conf.conf"
CO_SECTION = "WARRIOR"
config = configparser.ConfigParser()
config.read(CONFIG_FILE)
correlation_pod = config[CO_SECTION]['CORRELATION_POD']
classification_pod = config[CO_SECTION]['CLASSIFICATION_POD']
classification_profiler = config[CO_SECTION]['CLASSIFICATION_PROFILER']

headers = {'content-type': 'application/json'}
class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'container/index.html', context=None)
        
#get all data set list for classification(C) 
@csrf_exempt
def getClassificationDataSets(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + correlation_pod + '/db_features/api/get_dataset_list',headers = headers)
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

@csrf_exempt
def getProfilerResult(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        dataSetName = res["dataSetName"]
        fromTime = res["fromTime"]
        toTime = res["toTime"]
        labelName = res["labelName"]
        res = requests.post('http://' + ip_add + ':' + classification_pod + '/api/classification/v1/basicprofiling/' + classification_profiler + '/' + dataSetName + '/' + fromTime + '/' +  toTime + '/' + labelName,
                           headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        print("in status 200 create res", res)
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
        else:
           context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)
        
#get all feature groups for given data set for classification 
@csrf_exempt
def getClassificationGroups(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        dataSetName = res["dataSetName"]
        jobType = res ["jobType"]
        modelType = res["modelType"]
        res = requests.get('http://' + ip_add + ':' + classification_pod + '/api/classification/v1/groupnames/' + jobType + '/' + modelType + '/' + dataSetName,headers = headers,
                           auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

#get all feature mappings for given data set for classification(C)    
@csrf_exempt
def getClassificationDataSetMappings(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        data = res["dataSetName"]
        res = requests.get('http://' + ip_add + ':' + correlation_pod + '/db_features/api/get_dataset_mapping?db_name=' + data,headers = headers)
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)


#get all time columns  for given data set for classification(C)    
@csrf_exempt
def getClassificationTimeColumns(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        data = res["dataSetName"]
        res = requests.get('http://' + ip_add + ':' + correlation_pod + '/db_features/api/get_time_columns?db_name=' + data,headers = headers)
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

#get feature group details for given data set and feature group for classification    
@csrf_exempt
def getClassificationFeatureGroupDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        groupName = res["groupName"]
        jobType = res ["jobType"]
        modelType = res["modelType"]
        res = requests.get('http://' + ip_add + ':' + classification_pod + '/api/classification/v1/groups/' + jobType + '/' + modelType + '/' + groupName,headers = headers,
                            auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)


#update feature group details for given data set and feature group for classification    
@csrf_exempt
def updateClassificationFeatureGroup(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.put('http://' + ip_add + ':' + classification_pod + '/api/classification/v1/groups',data=json.dumps(res),headers = headers,
                           auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

#create feature group details for given data set and feature group for classification    
@csrf_exempt
def createClassificationFeatureGroup(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.post('http://' + ip_add + ':' + classification_pod + '/api/classification/v1/groups',data=json.dumps(res),headers = headers,
                            auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)



#schedule profiler after feature selection 
@csrf_exempt
def scheduleProfiler(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.post('http://' + ip_add + ':' + classification_pod + '/api/classification/v1/classificationschedulingapi',data=json.dumps(res),headers = headers,
                           auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

#delete feature group for classification    
@csrf_exempt
def deleteClassificationFeatureGroup(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        req = json.loads(buf)
        jobType = req["jobType"]
        modelType =  req["modelType"]
        groupName =  req["groupName"]
        res = requests.delete('http://' + ip_add + ':' + classification_pod + '/api/classification/v1/groups/' + jobType + '/' + modelType + '/' + groupName,headers = headers,
                            auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)
