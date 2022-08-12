from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from . import views

app_name = 'funcionario'

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:cpf>', views.ver_funcionario, name='ver_funcionario'),
    path('busca/', views.busca, name='busca'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)