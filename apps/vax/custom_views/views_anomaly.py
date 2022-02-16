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
anomaly_pod = config[CO_SECTION]['ANOMALY_POD']
el_url = config[CO_SECTION]['EL_URL']
el_pod = config[CO_SECTION]['EL_POD']
anomaly_profiler = config[CO_SECTION]['ANOMALY_PROFILER']
headers = {'content-type': 'application/json'}
class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'container/index.html', context=None)


#get AnmMd Configurations 
@csrf_exempt
def getAnmMdConfigurations(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/configurationformodelconfig/MODELI',headers = headers,
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



#Update anomaly Model Configuration(PUT)
@csrf_exempt
def updateAnmMdConfig(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    modelType = req["modelType"]
    modelConf =  req["modelConfig"]
    try:
        res = requests.put('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/modelconfigs/' + modelType,
                          data=json.dumps(modelConf), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
           print("in status 200 updateModel", context)
        else:
           context ={'status':'fail'}
           print("in status others updateModel", context)
    except:
        context = { 'status' :'Exception'}
        print("in except updateModel", context)
    finally:
        return JsonResponse(context)

#Update anomaly Model Configuration(PUT)
@csrf_exempt
def createAnmMdConfig(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    modelType = req["modelType"]
    modelConf =  req["modelConfig"]
    try:
        res = requests.post('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/modelconfigs/' + modelType,
                          data=json.dumps(modelConf), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
           print("in status 200 create Model", context)
        else:
           context ={'status':'fail'}
           print("in status others create Model", context)
    except:
        context = { 'status' :'Exception'}
        print("in except create Model", context)
    finally:
        return JsonResponse(context)



#Get all anomaly  page Model (GET)
@csrf_exempt
def getAllAnmModels(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        dataSetName = res["dataSetName"]
        fromTime = res["fromTime"]
        toTime = res["toTime"]
        res = requests.post('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/anomalies/anomalies*/' + dataSetName + '/' + fromTime + '/' +  toTime,
                           headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
           print("in status 200 create Model", context)
        else:
           context ={'status':'fail'}
           print("in status others create Model", context)
    except:
        context = { 'status' :'Exception'}
        print("in except create Model", context)
    finally:
        return JsonResponse(context)

#Get  anomaly   Model details (GET)
@csrf_exempt
def getAnmModelDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/allmodelsdetails/',
                           headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
           print("in status 200 create Model", context)
        else:
           context ={'status':'fail'}
           print("in status others create Model", context)
    except:
        context = { 'status' :'Exception'}
        print("in except create Model", context)
    finally:
        return JsonResponse(context)



#getAnomalyDataSets Data
@csrf_exempt
def getAnomalyDataSets(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/datasets/' ,headers = headers,
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

#getAnomalyDataSetFeatures Data
@csrf_exempt
def getAnomalyDataSetFeatures(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        data = res["dataSetName"]
        res = requests.get('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/datasets/' + data,headers = headers,
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


#getAllAnmModelConfigs Data
@csrf_exempt
def getAllAnmModelConfigs(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        res = requests.get('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/modelconfigs/' ,headers = headers,
                           auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail' }
    except:
        context = { 'status' :'Exception'}
    finally:
        return JsonResponse(context)

#getModelConfigUsingName 
@csrf_exempt
def getModelConfigUsingName(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    try:
        buf = request.body.decode('utf-8')
        res = json.loads(buf)
        modelType = res["modelType"]
        modelConfigName = res["modelConfigName"]
        res = requests.get('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/modelconfigs/'+ modelType + '/' + modelConfigName,headers = headers,
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

#delete anomaly modal config
@csrf_exempt
def deleteAnomalyModelConfiguration(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    modelType = req["modelType"]
    modelConfig =  req["modelConfig"]
    try:
        res = requests.delete('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/modelconfigs/' + modelType,
                          data=json.dumps(modelConfig), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 delModel", context)
        else:
            context ={'status':'fail'}
            print("failed in deleteModel", context)
    except:
        context = { 'status' :'exception'}
        print("exception in deletemodel", context)
    finally:
        return JsonResponse(context)

@csrf_exempt
def getTrainingDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    modelId = req["modelId"]
    headers = {'content-type': 'application/json'}    
    try:
        res = requests.get('http://' + ip_add + ':' + anomaly_pod +'/api/anomaly/v1/trainings/'+modelId, headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        ##replace the abv line of code with respective API
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 getTrainingDetails", context)
        else:
            context ={'status':'fail'}
            print("failed in getTrainingDetails", context)
    except:
        context = { 'status' :'exception'}
        print("exception in getTrainingDetails", context)
    finally:
        return JsonResponse(context)

@csrf_exempt
def getTrainedModels(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    scheduleName = req["schedule_name"]
    
    try:
        res = requests.post('http://' + ip_add + ':' + anomaly_pod +'/api/anomaly/v1/trainings/completed/'+ scheduleName, headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        ##replace the abv line of code with respective API
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 getTrainedModel", context)
        else:
            context ={'status':'fail'}
            print("failed in getTrainedModel", context)
    except:
        context = { 'status' :'exception'}
        print("exception in getTrainedModel", context)
    finally:
        return JsonResponse(context)

@csrf_exempt
def getAllAnmdTrainedModels(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    elk_url = "https://{0}:{1}{2}".format(ip_add, el_pod, el_url)
    try:
        res = requests.post('http://' + ip_add + ':' + anomaly_pod +'/api/anomaly/v1/trainings/completed/all', headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        ##replace the abv line of code with respective API
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response, 'elUrl': elk_url}
            print("in status 200 getTrainedModel", context)
        else:
            context ={'status':'fail'}
            print("failed in getTrainedModel", context)
    except:
        context = { 'status' :'exception'}
        print("exception in getTrainedModel", context)
    finally:
        return JsonResponse(context)

@csrf_exempt
def deleteTrainedModels(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    trainedModels = req["trainedModels"]
    try:
        res = requests.delete('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/trainings',
                          data=json.dumps(trainedModels), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        ##replace the abv line of code with respective API
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 deleteTrainedModel", context)
        else:
            context ={'status':'fail'}
            print("failed in deleteTrainedModel", context)
    except:
        context = { 'status' :'exception'}
        print("exception in deleteTrainedModel", context)
    finally:
        return JsonResponse(context)



##API to get anomaly detection data for anomaly detection tab
@csrf_exempt
def getTrainingResultAnomalyDetData(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    modelId = req["modelId"]
    headers = {'content-type': 'application/json'}    
    try:
        res = requests.get('http://' + ip_add + ':' + anomaly_pod +'/api/anomaly/v1/anomalydetection/'+ modelId, headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        ##replace the abv line of code with respective API
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 getTrainingDetails", context)
        else:
            context ={'status':'fail'}
            print("failed in getTrainingDetails", context)
    except:
        context = { 'status' :'exception'}
        print("exception in getTrainingDetails", context)
    finally:
        return JsonResponse(context)

##API to get anomaly detection data for table
@csrf_exempt
def getTrainingResultData(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    headers = {'content-type': 'application/json'}    
    try:
        res = requests.get('http://' + ip_add + ':' + anomaly_pod +'/api/anomaly/v1/trainingresult/', headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        ##replace the abv line of code with respective API
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 getTrainingDetails", context)
        else:
            context ={'status':'fail'}
            print("failed in getTrainingDetails", context)
    except:
        context = { 'status' :'exception'}
        print("exception in getTrainingDetails", context)
    finally:
        return JsonResponse(context)

@csrf_exempt
def getTrainingStatus(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    scheduleName = req["schedule_name"]
    modelType = req["modelType"]
    try:
        res = requests.get('http://' + ip_add + ':' + anomaly_pod +'/api/anomaly/v1/trainings/running/'+ modelType+ '/' +scheduleName, headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        ##replace the abv line of code with respective API
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 getTrainingStatus", context)
        else:
            context ={'status':'fail'}
            print("failed in getTrainingStatus", context)
    except:
        context = { 'status' :'exception'}
        print("exception in getTrainingStatus", context)
    finally:
        return JsonResponse(context)

#Schedule Anomaly detection
@csrf_exempt
def scheduleAnmdDetect(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    try:
        res = requests.post('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/anomalydetection',
                          data=json.dumps(req), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
           print("in status 200 create Model", context)
        else:
           context ={'status':'fail'}
           print("in status others create Model", context)
    except:
        context = { 'status' :'Exception'}
        print("in except create Model", context)
    finally:
        return JsonResponse(context)

#Schedule Anomalies
@csrf_exempt
def scheduleAnmlProfiling(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    try:
        res = requests.post('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/anomalies/profiling',
                          data=json.dumps(req), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
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
def anmlProfilingResult(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    anomalyId = req["anomalyId"]
    modelType = req["modelType"]
    try:
        res = requests.get('http://' + ip_add + ':' + anomaly_pod +'/api/anomaly/v1/anomalies/'+ anomaly_profiler+ '/' +anomalyId + '/'  + modelType , headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        ##replace the abv line of code with respective API
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except:
        context = { 'status' :'exception'}
    finally:
        return JsonResponse(context)

# Stop Training Model
@csrf_exempt
def stopTrainingModel(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    trainedModels = req["trainedModels"]
    try:
        res = requests.delete('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/trainings/running',
                          data=json.dumps(trainedModels), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        ##replace the abv line of code with respective API
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 stopTrainedModel", context)
        else:
            context ={'status':'fail'}
            print("failed in stopTrainedModel", context)
    except:
        context = { 'status' :'exception'}
        print("exception in stopTrainedModel", context)
    finally:
        return JsonResponse(context)

# Stop Anomaly Detection
@csrf_exempt
def stopAnomalyDetection(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    trainedModels = req["trainedModels"]
    try:
        res = requests.delete('http://' + ip_add + ':' + anomaly_pod + '/api/anomaly/v1/anomalydetection',
                          data=json.dumps(trainedModels), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        ##replace the abv line of code with respective API
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 stopAnomalyDetection", context)
        else:
            context ={'status':'fail'}
            print("failed in stopAnomalyDetection", context)
    except:
        context = { 'status' :'exception'}
        print("exception in stopAnomalyDetection", context)
    finally:
        return JsonResponse(context)