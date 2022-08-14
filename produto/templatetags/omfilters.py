from django.template import Library
from utils import utils


register = Library()


@register.filter
def formata_preco(val):
    return utils.formata_preco(val)


@register.filter
def cart_total_qtd(estoque):
    return utils.cart_total_qtd(estoque)


@register.filter
def cart_totals(estoque):
    return utils.cart_totals(estoque)