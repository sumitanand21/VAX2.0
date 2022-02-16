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

headers = {'content-type': 'application/json'}
class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'container/index.html', context=None)

#get all data set list for correlation 
@csrf_exempt
def getCorrelationDataSets(request):
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

        
#get all feature groups for given data set for correlation 
@csrf_exempt
def getCorrelationGroups(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        data = res["dataSetName"]
        res = requests.get('http://' + ip_add + ':' + correlation_pod + '/db_features/api/get_group_list?db_name=' + data,headers = headers)
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

#get all feature mappings for given data set for correlation    
@csrf_exempt
def getCorrelationDataSetMappings(request):
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


#get all time columns  for given data set for correlation    
@csrf_exempt
def getCorrelationTimeColumns(request):
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

#get feature group details  for given data set and feature group for correlation    
@csrf_exempt
def getFeatureGroupDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.post('http://' + ip_add + ':' + correlation_pod + '/db_features/api/get_feature_group',data=json.dumps(res),headers = headers)
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)


#update feature group details  for given data set and feature group for correlation    
@csrf_exempt
def updateFeatureGroup(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.put('http://' + ip_add + ':' + correlation_pod + '/db_features/api/put_feature_group',data=json.dumps(res),headers = headers)
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
def getCorrelationTableViewData(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        req = json.loads(buf)
        correlation_type = req["correlationType"]
        res = requests.get('http://' + ip_add + ':' + correlation_pod + '/correlation/api/get_table_view?correlation_type=' + correlation_type, headers=headers)
        if res.status_code == 200:
           response = res.json()
           data = response["data"]
           context = {'status':'success','data':data}
           print("success in fetching CorrelationTableViewData", context)
        else:
           context ={'status':'fail'}
           print("API failed to fetch CorrelationTableViewData", res.json())
    except Exception as exe:
        print("Exception while fetching 'getCorrelationTableViewData'.....")
        print(exe)
        context = {'status':'fail'}
    finally:
        return JsonResponse(context)

@csrf_exempt
def getcorrelationlistdata(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        req = json.loads(buf)
        correlation_type = req["correlationType"]
        res = requests.get('http://' + ip_add + ':' + correlation_pod + '/correlation/api/get_columns_list?correlation_type=' + correlation_type, headers=headers)
        if res.status_code == 200:
           response = res.json()
           data = response["columns"]
           context = {'status':'success','data':data}
           print("success in fetching CorrelationListData", context)
        else:
           context ={'status':'fail'}
           print("API failed to fetch CorrelationListData", res.json())
    except Exception as exe:
        print("Exception while fetching 'CorrelationListData'.....")
        print(exe)
        context = {'status':'fail'}
    finally:
        return JsonResponse(context)

@csrf_exempt
def getcorrelationheatmap(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    try:
        res = requests.post('http://' + ip_add + ':' + correlation_pod + '/correlation/api/get_correlation',
                          data=json.dumps(req), headers=headers)
        if res.status_code == 200:
           response = res.json()
           data = response["data"]
           context = {'status':'success','data':data}
           print("in status 200 getCompare", context)
        else:
           context ={'status':'fail'}
           print("in status others getCompare", context)
    except:
        context = { 'status' :'fail'}
        print("in except getCompare", context)
    finally:
        return JsonResponse(context)

@csrf_exempt
def getcorrelationplotdata(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    try:
        res = requests.post('http://' + ip_add + ':' + correlation_pod + '/correlation/api/get_plot_data',
                          data=json.dumps(req), headers=headers)
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data': response}
           print("in status 200 getCompare", context)
        else:
           context ={'status':'fail'}
           print("in status others getCompare", context)
    except:
        context = { 'status' :'fail'}
        print("in except getCompare", context)
    finally:
        return JsonResponse(context)


@csrf_exempt
def getpartionedchartdata(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    try:
        res = requests.post('http://' + ip_add + ':' + correlation_pod + '/correlation/api/get_correlated_features',
                          data=json.dumps(req), headers=headers)
        if res.status_code == 200:
           response = res.json()
           data = response["data"]
           context = {'status':'success', 'data': data}
           print("in status 200 getCompare", context)
        else:
           context ={'status':'fail'}
           print("in status others getCompare", context)
    except:
        context = { 'status' :'fail'}
        print("in except getCompare", context)
    finally:
        return JsonResponse(context)


#get positive groups api for correlation    
@csrf_exempt
def getPositiveGroups(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        req = json.loads(buf)
        res = requests.post('http://' + ip_add + ':' + correlation_pod + '/correlation/api/get_positive_groups', data=json.dumps(req), headers=headers)
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
           print("success in fetching PositiveGroups", context)
        else:
           context ={'status':'fail'}
           print("API failed to fetch PositiveGroups", res.json())
    except Exception as exe:
        print("Exception while fetching 'PositiveGroups'.....")
        print(exe)
        context = {'status':'fail'}
    finally:
        return JsonResponse(context)

#get Negative groups api for correlation    
@csrf_exempt
def getNegativeGroups(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        req = json.loads(buf)
        res = requests.post('http://' + ip_add + ':' + correlation_pod + '/correlation/api/get_negative_groups', data=json.dumps(req), headers=headers)
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
           print("success in fetching NegativeGroups", context)
        else:
           context ={'status':'fail'}
           print("API failed to fetch NegativeGroups", res.json())
    except Exception as exe:
        print("Exception while fetching 'NegativeGroups'.....")
        print(exe)
        context = {'status':'fail'}
    finally:
        return JsonResponse(context)

        
#get_group_details API for correlation
@csrf_exempt
def getGroupDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    try:
        res = requests.post('http://' + ip_add + ':' + correlation_pod + '/correlation/api/get_group_details',
                          data=json.dumps(req), headers=headers)
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data': response}
           print("in status 200 getgroupdetails", context)
        else:
           context ={'status':'fail'}
           print("in status others getgroupdetails", context)
    except:
        context = { 'status' :'fail'}
        print("in except getgroupdetails", context)
    finally:
        return JsonResponse(context)

#delete feature group details for correlation    
@csrf_exempt
def deleteFeatureGroup(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.post('http://' + ip_add + ':' + correlation_pod + '/db_features/api/delete_feature_group',data=json.dumps(res),headers = headers)
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)