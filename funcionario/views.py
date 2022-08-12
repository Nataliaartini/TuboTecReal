from django.shortcuts import render
from django.views.generic import ListView, DetailView
from django.views import View
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.http import Http404
from .models import Funcionario
from django.core.paginator import Paginator
from django.db.models import Q, Value
from django.db.models.functions import Concat
from django.contrib import messages
#
# class FuncionarioListView(ListView):
#     def get(self, request, *args, **kwargs):
#         return HttpResponse('funcionarios')
#     model = View.funcionario
#     template_name = 'funcionario/funcionario_list.html'
#     context_object_name = 'funcionarios'
#     ordering = ['nome']
#     paginate_by = 10
#
# class CadastrarFuncionarioView(View.CadastrarFuncionarioView):
#     def get(self, request, *args, **kwargs):
#         return HttpResponse('cadastrar')
#     template_name = 'funcionario/cadastrar.html'
#
# class EditarFuncionarioView(View.EditarFuncionarioView):
#     def get(self, request, *args, **kwargs):
#         return HttpResponse('editar')
#     template_name = 'funcionario/editar.html'

def index(request):
    contatos = Funcionario.objects.order_by('nome').filter(mostrar=True)
    paginator = Paginator(contatos, 4)
    page = request.GET.get("p")
    contatos = paginator.get_page(page)
    return render(request, 'contatos/index.html', {
        "contatos": contatos
    })

def ver_funcionario(request, cpf):
    contato = get_object_or_404(Funcionario, id=cpf)
    if not contato.mostrar:
        raise Http404()
    return render(request, 'funcionarios/ver_funcionario.html', {
        "funcionario": Funcionario
    })

def busca(request):
    termo = request.GET.get("termo")
    if termo is None or not termo:
        messages.add_message(request, messages.WARNING, 'Campo de busca não pode ser vazio')
        return redirect('index')
    campos = Concat("nome", Value(" "), "sobrenome")
    funcionarios = Funcionario.objects.annotate(nome_completo=campos).filter(Q(nome_completo__icontains=termo) |
                                                                     Q(telefone__icontains=termo))
    paginator = Paginator(funcionarios, 4)
    page = request.GET.get("p")
    funcionarios = paginator.get_page(page)
    return render(request, 'funcionarios/busca.html', {
        "funcionarios": funcionarios
    })