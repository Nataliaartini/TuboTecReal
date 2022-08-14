from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.views import View
from django.contrib import messages
from django.db.models import Q

from . import models

class Caixa(View):
    model = models.Caixa
    template_name = 'index.html'
    context_object_name = 'produtos'
    def get(self, request, *args, **kwargs):
        return render(request, 'caixa.html')

class Entrada(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse('entrada')
        # return render(request, 'financeiro/entrada.html')

class Saida(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse('saida')
        # return render(request, 'financeiro/saida.html')

class Ajustar(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse('ajustar')
        # return render(request, 'financeiro/ajustar.html')