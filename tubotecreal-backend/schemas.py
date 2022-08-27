from datetime import date

from pydantic import BaseModel


class OrigemBase(BaseModel):
    """Classe base para representar tipo de origem de produtos. """
    id: int
    descricao: str


class Origem(OrigemBase):
    """Classe para representar tipo de origem de produtos. """

    class Config:
        orm_mode = True


class CategoriaBase(BaseModel):
    """Classe base para representar categoria de produtos. """
    id: int
    descricao: str


class Categoria(OrigemBase):
    """Classe para representar categoria de produtos. """

    class Config:
        orm_mode = True


class TipoPagamentoBase(BaseModel):
    """Classe base para representar moedas de transação. """
    id: int
    descricao: str


class TipoPagamento(TipoPagamentoBase):
    """Classe para representar moedas de transação. """

    class Config:
        orm_mode = True


class ProdutoBase(BaseModel):
    """ Classe para representar a base do modelo de Produto. """
    descricao: str
    preco: float
    categoria_id: int
    quantidade_estoque: int


class ProdutoNovo(ProdutoBase):
    """ Classe para representar o modelo de Produto para criação, sem o ID. """
    pass


class ProdutoUpdate(ProdutoBase):
    """ Classe para representar o modelo de Produto completo."""
    id: int

    class Config:
        orm_mode = True


class Produto(ProdutoBase):
    """ Classe para representar o modelo de Produto completo."""
    id: int
    categoria: Categoria

    class Config:
        orm_mode = True


class FuncionarioBase(BaseModel):
    """ Classe para representar a base do modelo de Funcionário. """
    cpf: str
    nome: str
    observacao: str
    telefone: str
    salario: float
    data_inicio: date
    data_desligamento: date | None = None


class Funcionario(FuncionarioBase):
    """ Classe para representar o modelo de Funcionário para inserir. """
    cpf: str
    nome: str
    observacao: str
    telefone: str
    salario: float
    data_inicio: date
    data_desligamento: date | None = None

    class Config:
        orm_mode = True


class TransacaoBase(BaseModel):
    """ Classe para representar a base do modelo de Financeiro. """
    descricao: str
    data_transacao: date
    quantidade_produto: int
    pago: bool
    tipo_pagamento_id: int
    origem_id: int
    produto_id: int


class TransacaoNova(TransacaoBase):
    """ Classe para representar o modelo  para criação de objetos na tabela Financeiro,
    sem o ID.
    """
    pass


class TransacaoUpdate(TransacaoBase):
    """ Classe para representar o modelo  para criação de objetos na tabela Financeiro,
    sem o ID.
    """
    id: int


class Transacao(TransacaoBase):
    """ Classe para representar o modelo Financeiro completo."""
    id: int

    pagamento: TipoPagamento
    origem: Origem
    produto: Produto

    class Config:
        orm_mode = True
