from django.db import models

class Produto(models.Model):
    class Meta:
        db_table = 'produto'
        verbose_name = 'Produto'
        verbose_name_plural = 'Produtos'
        ordering = ['nome']
        unique_together = ['nome', 'marca']
        index_together = ['nome', 'marca']
        managed = True
        permissions = (
            ('view_produto', 'Can view produto'),
            ('add_produto', 'Can add produto'),
            ('change_produto', 'Can change produto'),
            ('delete_produto', 'Can delete produto'),
        )

    pass

