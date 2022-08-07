from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from . import views

app_name = 'arquivos'

urlpatterns = [
    path('', views.arquivos, name='arquivos'),
    path('anexar', views.anexar, name='anexar'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)