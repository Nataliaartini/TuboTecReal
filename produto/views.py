from django.shortcuts import render
from django.views.generic import ListView, DetailView, CreateView
from django.http import HttpResponse

class ListaProduto(ListView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('produtos')
    template_name = 'produto/lista.html'

class DetalheProduto(DetailView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('detalhes')
    template_name = 'produto/detalhe.html'

class EntradaEstoque(DetailView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('entrada')
    template_name = 'produto/entrada_estoque.html'

class SaidaEstoque(DetailView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('saida')
    template_name = 'produto/saida_estoque.html'

class CadastrarProduto(CreateView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('cadastro')
    template_name = 'produto/cadastrar.html'
    fields = ['nome', 'descricao', 'preco', 'estoque', 'imagem']
