from django.db import models
from django.utils import timezone

#app_name = 'funcionario'
class Funcionario(models.Model):
    cpf = models.CharField(max_length=11, unique=True)
    nome = models.CharField(max_length=30)
    sobrenome = models.CharField(max_length=70, blank=True)
    descricao = models.TextField(blank=True)
    telefone = models.CharField(max_length=100)
    salario = models.FloatField(default=0)
    data_criacao = models.DateTimeField(default=timezone.now)
    mostrar = models.BooleanField(default=True)
    # foto = models.ImageField(blank=True, upload_to='pictures/%Y/%m/')

    class Meta:
        db_table = 'funcionario'
        verbose_name = 'Funcionário'
        verbose_name_plural = 'Funcionários'
        ordering = ['nome']
        unique_together = ['nome', 'sobrenome']
        index_together = ['nome', 'sobrenome']
        managed = True
        # permissions = (
        #     ('view_funcionario', 'Can view funcionario'),
        #     ('add_funcionario', 'Can add funcionario'),
        #     ('change_funcionario', 'Can change funcionario'),
        #     ('delete_funcionario', 'Can delete funcionario'),
        # )

    def __str__(self):
        return self.nome