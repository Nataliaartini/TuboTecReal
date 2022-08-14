from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from . import views
from .views import *

app_name = 'produto'

urlpatterns = [
    path('', views.ListaProdutos.as_view(), name='lista'),
    path('<slug>', views.DetalheProduto.as_view(), name='detalhe'),
    path('entrada/<slug>', views.AdicionarAoEstoque.as_view(), name='entrada'),
    path('saida/<slug>', views.RemoverDoEstoque.as_view(), name='saida'),
    path('cadastrar/', views.Estoque.as_view(), name='cadastrar'),

    ] #+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)