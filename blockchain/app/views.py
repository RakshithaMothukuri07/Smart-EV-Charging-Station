from django.shortcuts import render
from .models import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
from .logic import *

@api_view(['POST','GET'])
def slot_generation(request):
    id=request.data.get('id')
    amount=request.data.get('amount')
    booking_time=request.data.get('booking_time')
    duration_minutes=request.data.get('duration_minutes')
    status=request.data.get('status')
    user_id=request.data.get('user_id')
    slot_id=request.data.get('slot_id')

    user_data=addData({
        "id":id,
        "amount":amount,
        "duration_minutes":duration_minutes,
        "booking_time":booking_time,
        "slot_id":slot_id,
        "status":status,
        "user_id":user_id,
    })
    print(user_data,'xfcrmjvgcghivgo')

    return Response({"Success":"add successfully",
        "id":id,
        "amount":amount,
        "duration_minutes":duration_minutes,
        "booking_time":booking_time,
        "slot_id":slot_id,
        "status":status,
        "user_id":user_id,           
    })


@api_view(['POST', 'GET'])
def view_data(request, user_id):
    blockchain_data = retriveData()  
    print("Blockchain Data:", blockchain_data)  
    user_id_str = str(user_id)
    user_data = [item for item in blockchain_data if str(item.get("user_id")) == user_id_str]
    print("User Data Found:", user_data)

    if user_data:
        print("Data Retrieved:", user_data)
        return Response({"Success": "Data retrieved successfully", "data": user_data})
    else:
        return Response({"Error": "No data found for the provided user_id"}, status=404)
