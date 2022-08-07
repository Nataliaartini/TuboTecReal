from django.shortcuts import render
from django.views.generic import ListView, DetailView
from django.views import View
from django.http import HttpResponse

class ArquivosListView(ListView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('listar arquivos')
    model = View.arquivos
    template_name = 'arquivos/arquivos_list.html'
    context_object_name = 'arquivos'
    ordering = ['data']
    paginate_by = 10

class AnexarArquivoView(View.AnexarArquivoView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('anexar arquivo')
    template_name = 'arquivos/anexar.html'


