from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from . import views

app_name = 'financeiro'

urlpatterns = [
    path('', views.caixa, name='caixa'),
    path('entrada/', views.entrada, name='entrada'),
    path('saida/', views.saida, name='saida'),
    path('ajustar/', views.ajustar, name='ajustar'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)