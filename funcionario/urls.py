from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from . import views
from .views import *

# app_name = 'funcionario'

urlpatterns = [
    path('funcionario/', views.index, name='funcionario'),
    path('funcionario/<int:cpf>', views.ver_funcionario, name='ver_funcionario'),
    path('busca/', views.busca, name='busca'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)