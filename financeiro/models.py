from django.db import models

class Caixa(models.Model):
    class Meta:
        verbose_name = 'Caixa'
        ordering = ['-id']

    def __str__(self):
        return self.nome

    nome = models.CharField(max_length=100)
    descricao = models.TextField()
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)