from django.urls import path
from .views import home, visa

app_name = "landing"

urlpatterns = [
    path("", home, name="home"),
    path("visa/", visa, name="visa"),
]
