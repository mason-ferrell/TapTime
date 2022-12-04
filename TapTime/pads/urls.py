from django.urls import path
from . import views

urlpatterns = [
    path("", views.generate_index, name="generate_index"),
]