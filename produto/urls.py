from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from . import views

app_name = 'produto'

urlpatterns = [
    path('', views.ListaProduto.as_view(), name='lista'),
    path('<slug>', views.DetalheProduto.as_view(), name='detalhe'),
    path('cadastrar', views.CadastrarProduto.as_view(), name='cadastrar'),
    path('entrada de estoque', views.CadastrarProduto.as_view(), name='entrada_estoque'),
    path('saída de estoque', views.CadastrarProduto.as_view(), name='saida_estoque'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)