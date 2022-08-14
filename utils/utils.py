def formata_preco(val):
    return f'R$ {val:.2f}'.replace('.', ',')


def estoque_total_qtd(estoque):
    return sum([item['quantidade'] for item in estoque.values()])
