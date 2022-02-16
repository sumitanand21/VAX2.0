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
scheduler_pod = config[CO_SECTION]['SCHEDULER_POD']
forecast_socket = config[CO_SECTION]['FORECAST_SOCKET']
profiler_socket = config[CO_SECTION]['PROFILER_SOCKET']
anomaly_socket = config[CO_SECTION]['ANOMALY_SOCKET']
datainsight_socket = config[CO_SECTION]['DATAINSIGHT_SOCKET']
socket_scheduler_exp_time = config[CO_SECTION]['SOCKET_SCHEDULER_EXP_TIME']
headers = {'content-type': 'application/json'}
class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'container/index.html', context=None)


#Create  task  (POST)
@csrf_exempt
def createTask(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    try:
        res = requests.post('http://' + ip_add + ':' + scheduler_pod + '/api/scheduler/v1/schedule/',
                          data=json.dumps(req), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
        else:
           response = res.json()
           context ={'status':'fail','data':response}
    except:
        context = { 'status' :'exception' }
    finally:
        return JsonResponse(context)


#Update  task  (PUT)
@csrf_exempt
def updateTask(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    try:
        res = requests.put('http://' + ip_add + ':' + scheduler_pod + '/api/scheduler/v1/schedule/',
                          data=json.dumps(req), headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
           response = res.json()
           context = {'status':'success','data':response}
        else:
           response = res.json()
           context ={'status':'fail','data':response}
    except:
        context = { 'status' :'exception'}
    finally:
        return JsonResponse(context)

@csrf_exempt
def getScheduleDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    #req = json.loads(buf)
    scheduleId = buf
    headers = {'content-type': 'application/json'}
    try:
        res = requests.get('http://' + ip_add + ':' + scheduler_pod +'/api/scheduler/v1/schedule/'+scheduleId, headers=headers, auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        ##replace the abv line of code with respective API
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 getTaskScheduleDetails", context)
        else:
            context ={'status':'fail'}
            print("failed in getTaskScheduleDetails", context)
    except:
        context = { 'status' :'exception'}
        print("exception in getTaskScheduleDetails", context)
    finally:
        return JsonResponse(context)

@csrf_exempt
def getalltaskDetails(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    #req = json.loads(buf)
    scheduleId = buf
    
    try:
        res = requests.get('http://' + ip_add + ':' + scheduler_pod + '/api/scheduler/v1/custom-schedule',
                            auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
            print("in status 200 getalltaskDetails", context)
        else:
            context ={'status':'fail'}
            print("failed in getalltaskDetails", context)
    except Exception as e:
        context = { 'status' :'exception'}
        print(e)
        print("exception in getalltaskDetails", context)
    finally:
        return JsonResponse(context)
'''
/** Description : To 'SUSPENDED'/'DELETE'/'ACTIVE'/'RUN' a schedule/Task
    params  : actionType('SUSPENDED'/'DELETE'/'ACTIVE'/'RUN') & array of schedule ids ['id1','id2'] 
    backend API : scheduler 'scheduleActions' API 
    response body : Empty (status : 200 /500)
    return type : status('success'/'fail') **/
'''
@csrf_exempt
def actionOnTask(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    req = json.loads(buf)
    scheduleId = req["id"]
    actionType = req["actionType"]

    headers = {'content-type': 'application/json'}
    if scheduleId != None:
        scheduleId = ast.literal_eval(scheduleId)
    try:
        res = requests.post('http://' + ip_add + ':' + scheduler_pod + '/api/scheduler/v1/schedule/actions/'+str(actionType),
                            json= scheduleId,headers = headers,auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            context = {'status':'success'}
        else:
            context ={'status':'fail','data':res.status_code}
            print("failed in actionOnTask", context)
    except:
        context = { 'status' :'exception'}
        print("exception in actionOnTask", context)
    finally:
        return JsonResponse(context)


@csrf_exempt
def getalltask(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    buf = request.body.decode('utf-8')
    scheduleId = buf
    try:
        res = requests.get('http://' + ip_add + ':' + scheduler_pod + '/api/scheduler/v1/allschedules',
                            auth=HTTPBasicAuth('fujitsu', 'fujitsu'))
        if res.status_code == 200:
            response = res.json()
            context = {'status':'success','data':response}
        else:
            context ={'status':'fail'}
    except Exception as e:
        context = { 'status' :'exception'}
        print(e)
    finally:
        return JsonResponse(context)

@csrf_exempt
def socketUrls(request):
    whole_host = request.get_host()
    ip_add = whole_host.split(':')[0]
    forecast = "https://{0}:{1}".format(ip_add, forecast_socket)
    anomaly = "https://{0}:{1}".format(ip_add, anomaly_socket)
    profiler = "https://{0}:{1}".format(ip_add, profiler_socket)
    datainsight = "https://{0}:{1}".format(ip_add, datainsight_socket)
    context = {'status':'success' , 'forecast': forecast, 'anomaly': anomaly, 'profiler': profiler, 'dataMng': datainsight, 'socketExpTime': socket_scheduler_exp_time}
    return JsonResponse(context)




