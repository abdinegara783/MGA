from django.shortcuts import render


def home(request):
    return render(request, "landing/index.html")


def visa(request):
    return render(request, "landing/visa.html")
