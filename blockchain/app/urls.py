from django.contrib import admin
from django.urls import path
from .import views

urlpatterns=[
    path('api/slot_generation/',views.slot_generation,name='slot_generation'),
    path('view_data/<int:user_id>/',views.view_data,name='view_data'),

]