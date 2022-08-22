from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.associationproxy import association_proxy

from database import Base


class Origem(Base):
    """ Classe para representar a tabela `tipo_movimentacao` no banco de dados."""
    __tablename__ = "tipo_origem_produto"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String(50), nullable=False)

    transacoes = relationship("Transacao", back_populates="origem")


class Categoria(Base):
    """ Classe para representar a tabela `tipo_movimentacao` no banco de dados."""
    __tablename__ = "categoria_produto"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String(50), nullable=False)

    produtos = relationship("Produto", back_populates="categoria")



class Moeda(Base):
    """ Classe para representar a tabela `moeda` no banco de dados."""
    __tablename__ = "moedas"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String(30), nullable=False)
    simbolo = Column(String(5), nullable=False)

    transacoes = relationship("Transacao", back_populates="moeda")


class Produto(Base):
    """ Classe para representar a tabela `produto` no banco de dados."""
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String(50), nullable=False)
    preco = Column(Float)
    categoria_id = Column(Integer, ForeignKey("categoria_produto.id"))
    quantidade_estoque = Column(Integer)

    categoria = relationship("Categoria", back_populates="produtos")
    transacoes = relationship("Transacao", back_populates="produto")



class Funcionario(Base):
    """ Classe para representar a tabela `funcionarios` no banco de dados."""
    __tablename__ = "funcionarios"

    cpf = Column(String(14), primary_key=True, index=True)
    nome = Column(String(80), nullable=False)
    observacao = Column(String(300))
    telefone = Column(String(14))
    salario = Column(Float)
    data_inicio = Column(DateTime, nullable=False)
    data_desligamento = Column(DateTime, nullable=True)



class Transacao(Base):
    """ Classe para representar a tabela `funcionarios` no banco de dados."""
    __tablename__ = "transacoes"

    id = Column(Integer, primary_key=True, index=True)

    descricao = Column(String(80), nullable=False)
    data_transacao = Column(DateTime, nullable=False)
    quantidade_produto = Column(Integer, nullable=False)
    pago = Column(Boolean, nullable=False)

    moeda_id = Column(Integer, ForeignKey("moedas.id"))
    origem_id = Column(Integer, ForeignKey("tipo_origem_produto.id"))
    produto_id = Column(Integer, ForeignKey("produtos.id"))

    produto = relationship("Produto", back_populates="transacoes")
    origem = relationship("Origem", back_populates="transacoes")
    moeda = relationship("Moeda", back_populates="transacoes")
