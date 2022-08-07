from django.shortcuts import render
from django.views.generic import ListView, DetailView
from django.views import View
from django.http import HttpResponse


class Caixa(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse('Caixa')
        # return render(request, 'financeiro/caixa.html')

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