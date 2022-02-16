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
forecast_pod = config[CO_SECTION]['FORECAST_POD']
forecast_orderid = config[CO_SECTION]['FORECAST_ORDERID']
forecast_grafana = config[CO_SECTION]['FORECAST_GRAFANA']
forecast_grafana_url = config[CO_SECTION]['FORECAST_GRAFANA_URL']

headers = {'content-type': 'application/json'}
class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'container/index.html', context=None)


def getModalconfigTimeseries(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + forecast_pod + '/api/scheduler/v1/model-configs/TIMESERIES',auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context = {'status':'fail'}
    except:
        context = {'status':'fail'}
    finally:
        return JsonResponse(context)

headers = {'content-type': 'application/json'}
class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'container/index.html', context=None)

#Get Datasetnames
@csrf_exempt
def getDatasetname(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        headers = {'content-type': 'application/json'}
        res = requests.get('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/datasets',
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

#ForecastSelection data table
@csrf_exempt
def getForecastSelection(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        data = res["dataSetName"]
        headers = {'content-type': 'application/json'}  
        res = requests.get('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/forecastselection/'+ data,headers = headers,
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


#ForecastProcessing data table
@csrf_exempt
def getForecastProcessing(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        data = res["dataSetName"]
        headers = {'content-type': 'application/json'}  
        res = requests.get('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/forecastselectionprocesingtable/'+ data,headers = headers,
                           auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context = {'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

#ForecastProcessing table model details
@csrf_exempt
def forecastProcessingModelDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    forecast_grf = "https://{0}:{1}".format(ip_add, forecast_grafana)
    forecast_grfurl = "https://{0}:{1}".format(ip_add, forecast_grafana_url)
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        dataset = res["dataSetName"]
        dataid =  res["dataId"]
        headers = {'content-type': 'application/json'}  
        res = requests.get('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/forecastprocessingbyid/'+ dataset + '/' + dataid ,headers = headers,
                           auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response, 'orderid':forecast_orderid ,'grafanaUrl':forecast_grf,'grfnUrl':forecast_grfurl}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)
# forecastselectionupdate
@csrf_exempt
def updateForecastSelectiontable(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    res = json.loads(buf)
    try:
        r = requests.put('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/forecastselectionupdate',
                          data=json.dumps(res), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        print("in try", r)
    except:
        context = {'data': 'API Failed to fetch data', 'status': 'failed'}
        print("in except", context)
        return JsonResponse(context)
    json_content = json.loads(r.text)
    if r.status_code == 200:
        print("in r.status_code", r.status_code)
        context = {'status': "success", 'data': json_content}
    else:
        if r.status_code == 500:
            res = r.json()
            context = {'status':'failed','data':res}
        else:
            context = {'status': "failed", 'data': json_content}
    return JsonResponse(context)
    

@csrf_exempt
def getAllModelConfigs(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        headers = {'content-type': 'application/json'}  
        res = requests.get('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/modelconfigs/',headers = headers,
                           auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'exeption'}
    finally:
        return JsonResponse(context)

@csrf_exempt
def getModelConfigDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        jobType = res["jobType"]
        modelConfig =  res["modelConfig"]
        headers = {'content-type': 'application/json'}  
        res = requests.get('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/modelconfigs/' + jobType + '/' + modelConfig ,headers = headers,
                           auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200", context)
        else:
            context ={'status':'fail'}
            print("in status others", context)
    except:
        context = { 'status' :'fail'}
        print("in except", context)
    finally:
        return JsonResponse(context)
    
@csrf_exempt
def updateForecastSelection(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    res = json.loads(buf)
    try:
        r = requests.put('http://' + ip_add + ':' + forecast_pod + '/api/scheduler/v1/pmforecast',
                          data=json.dumps(res), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        print("in try", r)
    except:
        context = {'data': 'API Failed to fetch data', 'status': 'failed'}
        print("in except", context)
        return JsonResponse(context)
    json_content = json.loads(r.text)
    if r.status_code == 200:
        print("in r.status_code", r.status_code)
        context = {'status': "success", 'data': json_content}
    else:
        if r.status_code == 500:
            res = r.json()
            context = {'status':'failed','data':res}
        else:
            context = {'status': "failed", 'data': json_content}
    return JsonResponse(context)

@csrf_exempt
def saveForecastSelection(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    res = json.loads(buf)
    try:
        r = requests.post('http://' + ip_add + ':' + forecast_pod + '/api/scheduler/v1/pmforecast',
                          data=json.dumps(res), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        print("in try", r)
    except:
        context = {'data': 'API Failed to fetch data', 'status': 'failed'}
        print("in except", context)
        return JsonResponse(context)
    json_content = json.loads(r.text)
    if r.status_code == 200:
        print("in r.status_code", r.status_code)
        context = {'status': "success", 'data': json_content}
    else:
        if r.status_code == 500:
            res = r.json()
            context = {'status':'failed','data':res}
        else:
            context = {'status': "failed", 'data': json_content}
    return JsonResponse(context)


@csrf_exempt
def handleForecastProcessing(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    res = json.loads(buf)
    try:
        r = requests.put('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/forecastselectionprocesingtableupdate',
                          data=json.dumps(res), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
    except:
        context = {'data': 'API Failed to fetch data', 'status': 'failed'}
        print("in except", context)
        return JsonResponse(context)
    json_content = json.loads(r.text)
    if r.status_code == 200:
        print("in r.status_code", r.status_code)
        context = {'status': "success", 'data': json_content}
    else:
        if r.status_code == 500:
            res = r.json()
            context = {'status':'failed','data':res}
        else:
            context = {'status': "failed", 'data': json_content}
    return JsonResponse(context)

#create Forecast Model Configuration(POST)
@csrf_exempt
def createModelConfiguration(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    jobType = req["jobType"]
    modelConfig =  req["modelConfig"]
    try:
        res = requests.post('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/modelconfigs/' + jobType,
                          data=json.dumps(modelConfig), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
           print("in status 200 createModel", context)
        else:
           context ={'status':'fail'}
           print("in status others createModel", context)
    except:
        context = { 'status' :'fail'}
        print("in except createModel", context)
    finally:
        return JsonResponse(context)


#update Forecast Model Configuration(PUT)
@csrf_exempt
def updateModelConfiguration(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    jobType = req["jobType"]
    modelConfig =  req["modelConfig"]
    try:
        res = requests.put('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/modelconfigs/' + jobType,
                          data=json.dumps(modelConfig), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
           print("in status 200 updateModel", context)
        else:
           context ={'status':'fail'}
           print("in status others updateModel", context)
    except:
        context = { 'status' :'fail'}
        print("in except updateModel", context)
    finally:
        return JsonResponse(context)

#delete Forecast Model Configuration(DELETE) 
@csrf_exempt
def deleteModelConfiguration(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    jobType = req["jobType"]
    modelConfig =  req["modelConfig"]
    try:
        res = requests.delete('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/modelconfigs/' + jobType,
                          data=json.dumps(modelConfig), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 delModel", context)
        else:
            context ={'status':'fail'}
            print("in status others delModel", context)
    except:
        context = { 'status' :'fail'}
        print("in except deleteModel", context)
    finally:
        return JsonResponse(context)

#get Configuration drop down for model config(GET)
@csrf_exempt
def configurationModelConfig(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        headers = {'content-type': 'application/json'}  
        res = requests.get('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/configurationformodelconfig/', headers = headers,
                           auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200", context)
        else:
            context ={'status':'fail'}
            print("in status others", context)
    except:
        context = { 'status' :'fail'}
        print("in except", context)
    finally:
        return JsonResponse(context)

#update Forecast Schedule(PUT)
@csrf_exempt
def scheduleForecastSelection(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    scheduleForecast =  req["scheduleForecast"]
    try:
        res = requests.put('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/forecastschedulingapi',
                          data=json.dumps(scheduleForecast), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
           print("in status 200 updateSchedule", context)
        else:
           context ={'status':'fail'}
           print("in status others updateSchedule", context)
    except:
        context = { 'status' :'fail'}
        print("in except updateSchedule", context)
    finally:
        return JsonResponse(context)        

#get Forecast Compare details(POST)
@csrf_exempt
def getForecastCompare(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    forecast_grf = "https://{0}:{1}".format(ip_add, forecast_grafana)
    forecast_grfurl = "https://{0}:{1}".format(ip_add, forecast_grafana_url)
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    dataIds =  req["dataIds"]
    try:
        res = requests.post('http://' + ip_add + ':' + forecast_pod + '/api/forecast/v1/forecastprocessingbylistids',
                          data=json.dumps(dataIds), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response,'orderid':forecast_orderid ,'grafanaUrl':forecast_grf,'grfnUrl':forecast_grfurl}
           print("in status 200 getCompare", context)
        else:
           context ={'status':'fail'}
           print("in status others getCompare", context)
    except:
        context = { 'status' :'fail'}
        print("in except getCompare", context)
    finally:
        return JsonResponse(context)



       