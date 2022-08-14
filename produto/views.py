from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.views import View
from django.contrib import messages
from django.db.models import Q

from . import models

# class ListaProduto(ListView):
#     def get(self, request, *args, **kwargs):
#         return HttpResponse('produtos')
#     template_name = 'produto/lista.html'
#
# class DetalheProduto(DetailView):
#     def get(self, request, *args, **kwargs):
#         return HttpResponse('detalhes')
#     template_name = 'produto/detalhe.html'
#
# class EntradaEstoque(DetailView):
#     def get(self, request, *args, **kwargs):
#         return HttpResponse('entrada')
#     template_name = 'produto/entrada_estoque.html'
#
# class SaidaEstoque(DetailView):
#     def get(self, request, *args, **kwargs):
#         return HttpResponse('saida')
#     template_name = 'produto/saida_estoque.html'
#
# class CadastrarProduto(CreateView):
#     def get(self, request, *args, **kwargs):
#         return HttpResponse('cadastro')
#     template_name = 'produto/cadastrar.html'
#     fields = ['nome', 'descricao', 'preco', 'estoque', 'imagem']

#------------------------------------------------------------------------------


class ListaProdutos(ListView):
    model = models.Produto
    template_name = 'produto/lista.html'
    context_object_name = 'produtos'
    paginate_by = 9
    ordering = ['-id']

class Busca(ListaProdutos):
    def get_queryset(self, *args, **kwargs):
        termo = self.request.GET.get('termo') or self.request.session['termo']
        qs = super().get_queryset(*args, **kwargs)

        if not termo:
            return qs

        self.request.session['termo'] = termo

        qs = qs.filter(
            Q(nome__icontains=termo) |
            Q(descricao_curta__icontains=termo) |
            Q(descricao_longa__icontains=termo)
        )

        self.request.session.save()
        return qs

class DetalheProduto(DetailView):
    model = models.Produto
    template_name = 'produto/detalhe.html'
    context_object_name = 'produto'
    slug_url_kwarg = 'slug'

class AdicionarAoEstoque(View):
    def get(self, *args, **kwargs):
        http_referer = self.request.META.get('HTTP_REFERER', reverse('produto:lista'))
        variacao_id = self.request.GET.get('vid')

        if not variacao_id:
            messages.error(self.request, 'Produto não existe')
            return redirect(http_referer)

        variacao = get_object_or_404(models.Variacao, id=variacao_id)
        variacao_estoque = variacao.estoque
        produto = variacao.produto
        produto_id = produto.id
        produto_nome = produto.nome
        variacao_nome = variacao.nome or ''
        preco_unitario = variacao.preco
        quantidade = 1
        slug = produto.slug
        imagem = produto.imagem

        if imagem:
            imagem = imagem.name
        else:
            imagem = ''

        if variacao.estoque < 1:
            messages.error(self.request, 'Estoque insuficiente')
            return redirect(http_referer)

        if not self.request.session.get('estoque'):
            self.request.session['estoque'] = {}
            self.request.session.save()

        estoque = self.request.session['estoque']

        if variacao_id in estoque:
            quantidade_estoque = estoque[variacao_id]['quantidade']
            quantidade_estoque += 1

            if variacao_estoque < quantidade_estoque:
                messages.warning(
                    self.request,
                    f'Estoque insuficiente para {quantidade_estoque}x no produto "{produto_nome}". '
                    f'Adicionamos {variacao_estoque}x no seu carrinho.')
                quantidade_estoque = variacao_estoque

            estoque[variacao_id]['quantidade'] = quantidade_estoque
            estoque[variacao_id]['preco_quantitativo'] = preco_unitario * quantidade_estoque

        else:
            estoque[variacao_id] = {
                'produto_id': produto_id,
                'produto_nome': produto_nome,
                'variacao_nome': variacao_nome,
                'variacao_id': variacao_id,
                'preco_unitario': preco_unitario,
                'preco_quantitativo': preco_unitario,
                'quantidade': 1,
                'slug': slug,
                'imagem': imagem,
            }

        self.request.session.save()

        messages.success(
            self.request,
            f'Produto {produto_nome} {variacao_nome} adicionado ao seu estoque {estoque[variacao_id]["quantidade"]}x.'
        )

        return redirect(http_referer)

class RemoverDoEstoque(View):
    def get(self, *args, **kwargs):
        http_referer = self.request.META.get(
            'HTTP_REFERER',
            reverse('produto:lista')
        )
        variacao_id = self.request.GET.get('vid')

        if not variacao_id:
            return redirect(http_referer)

        if not self.request.session.get('estoque'):
            return redirect(http_referer)

        if variacao_id not in self.request.session['estoque']:
            return redirect(http_referer)

        estoque = self.request.session['estoque'][variacao_id]

        messages.success(
            self.request,
            f'Produto {estoque["produto_nome"]} {estoque["variacao_nome"]} '
            f'removido do seu estoque.'
        )

        del self.request.session['estoque'][variacao_id]
        self.request.session.save()
        return redirect(http_referer)


class Estoque(View):
    def get(self, *args, **kwargs):
        contexto = {
            'estoque': self.request.session.get('estoque', {})
        }

        return render(self.request, 'produto/estoque.html', contexto)
#ainda nao sei como vai ficar essa parte do estoque "detalhe" do produto talvez, tem que ver