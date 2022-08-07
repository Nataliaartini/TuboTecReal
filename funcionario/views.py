from django.shortcuts import render
from django.views.generic import ListView, DetailView
from django.views import View
from django.http import HttpResponse

class FuncionarioListView(ListView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('funcionarios')
    model = View.funcionario
    template_name = 'funcionario/funcionario_list.html'
    context_object_name = 'funcionarios'
    ordering = ['nome']
    paginate_by = 10

class CadastrarFuncionarioView(View.CadastrarFuncionarioView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('cadastrar')
    template_name = 'funcionario/cadastrar.html'

class EditarFuncionarioView(View.EditarFuncionarioView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('editar')
    template_name = 'funcionario/editar.html'