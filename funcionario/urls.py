from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from . import views

app_name = 'funcionario'

urlpatterns = [
    path('', views.funcionario, name='funcionarios'),
    path('cadastrar', views.cadastrar, name='cadastrar'),
    path('editar/<int:pk>', views.editar, name='editar'),
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)