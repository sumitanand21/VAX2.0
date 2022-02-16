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

datainsight_pod = config[CO_SECTION]['DATAINSIGHT_POD']


headers = {'content-type': 'application/json'}
class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'container/index.html', context=None)

#get all configuration data(Table view) 
@csrf_exempt
def getConfigurationTableview(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/configuration/api/getConfigurationList',headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

#get configuration data(Details view) 
@csrf_exempt
def getConfigurationDetailedView(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        data = res["dataSetName"]
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/configuration/api/getConfiguration?configurationName=' + data,headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

#get all DB Type(Upsert DB Type) 
@csrf_exempt
def getConfigurationDBType(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/configuration/api/getDbList',headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

#Create Configuration page
@csrf_exempt
def createConfiguration(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    try:
        res = requests.post('http://' + ip_add + ':' + datainsight_pod + '/configuration/api/postConfiguration',
                          data=json.dumps(req), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
        else:
           context ={'status':'fail'}
    except:
        context = { 'status' :'exception'}
    finally:
        return JsonResponse(context)

#Create New DB Type
@csrf_exempt
def createNewDBType(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    try:
        res = requests.post('http://' + ip_add + ':' + datainsight_pod + '/configuration/api/postDbType',
                          data=json.dumps(req), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
        else:
           context ={'status':'fail'}
    except:
        context = { 'status' :'exception'}
    finally:
        return JsonResponse(context)

#Update Configuration API
@csrf_exempt
def updateConfiguration(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    try:
        res = requests.put('http://' + ip_add + ':' + datainsight_pod + '/configuration/api/updateConfiguration',
                          data=json.dumps(req), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
        else:
           context ={'status':'fail'}
    except:
        context = { 'status' :'exception'}
    finally:
        return JsonResponse(context)

#get all data set list for data insight
@csrf_exempt
def getDataSourceList(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/getDataSourceList',headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)
        

#get all data set details for data insight
@csrf_exempt
def getDataSource(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        data = res["dataSetName"]
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/getDataSource?dataSetName=' + data ,headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)
# deleteDataSource
@csrf_exempt
def deleteDataSource(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    res = json.loads(buf)
    data = res["dataSetName"]
    try:
        res = requests.delete('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/deleteDataSource?dataSetName=' + data,headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# deleteConfiguration
@csrf_exempt
def deleteConfiguration(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    res = json.loads(buf)
    data = res["configName"]
    try:
        res = requests.delete('http://' + ip_add + ':' + datainsight_pod + '/configuration/api/deleteConfiguration?configurationName=' + data,headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# get all Job Type list
@csrf_exempt
def getJobTypeList(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/getJobTypeList',headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# get all property Type list
@csrf_exempt
def getPropertyTypeList(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/getPropertyTypeList',headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# Post to fetch data preview details
@csrf_exempt
def getDataPreviewDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.post('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/getDataPreview',data=json.dumps(res),headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# get all data set Configuration list
@csrf_exempt
def getConfigurationList(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/configuration/api/getConfigurationNamesList',headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# get all data source list
@csrf_exempt
def getConfigurationDet(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        configurationName = res["configurationName"]
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/configuration/api/getConfiguration?configurationName=' + configurationName,headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# post all steps
@csrf_exempt
def getStepsDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.post('http://' + ip_add + ':' + datainsight_pod + '/configuration/api/getDataSourceDetails',data=json.dumps(res),headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# post Fetch Feature
@csrf_exempt
def getFeatureDet(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.post('http://' + ip_add + ':' + datainsight_pod + '/configuration/api/getFetchFeatures',data=json.dumps(res),headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# post create Data Set
@csrf_exempt
def createDataSet(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.post('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/postDataSource',data=json.dumps(res),headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# put update Data Set
@csrf_exempt
def updateDataSet(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.put('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/updateDataSource',data=json.dumps(res),headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# post File Upload Data Set
@csrf_exempt
def fileUploadDataSet(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        in_memory_uploaded_file = request.FILES['file_uploaded']
        files = {'file_uploaded': in_memory_uploaded_file}
        mediaheaders = {
            "cache-control": "no-cache",
        }
        res = requests.post('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/postFile', files=files, headers=mediaheaders, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        print("res", res)
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except Exception as e:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# post stream Data Schedule
@csrf_exempt
def streamDataSchedule(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        res = requests.post('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/postScheduleMessage',data=json.dumps(res),headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# get Stream Status
@csrf_exempt
def getStreamScheduleStatus(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        dataSetName = res["dataSetName"]
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/getScheduleMessage?dataSetName=' + dataSetName,headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# get Data set for JOb Type
@csrf_exempt
def getDataSetForJobType(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        jobType = res["jobType"]
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/getDataSet?jobType=' + jobType,headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

# get Summary iframe details
@csrf_exempt
def getSummaryDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        dataSetName = res["dataSetName"]
        res = requests.get('http://' + ip_add + ':' + datainsight_pod + '/datasource/api/getIFrameDetails/' + dataSetName,headers = headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)