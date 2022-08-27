import models
import schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session


def insere_produto(db: Session, produto: schemas.ProdutoNovo):
    """ Função para inserir um novo produto no banco de dados """

    produto_novo = models.Produto(**produto.dict())

    db.add(produto_novo)
    db.commit()
    db.refresh(produto_novo)

    return produto_novo


def atualiza_produto(db: Session, produto: schemas.ProdutoUpdate):
    """ Função para atualizar produto no banco de dados """

    produto_ = db.get(models.Produto, produto.id)
    if produto_ is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")

    # atualiza os campos necessários
    for var, value in vars(produto).items():
        setattr(produto_, var, value) if value else None

    db.add(produto_)
    db.commit()
    db.refresh(produto_)
    return produto_


def remove_produto(db: Session, produto_id: int):
    """ Função para remover um produto do banco de dados """

    produto_ = db.get(models.Produto, produto_id)
    if produto_ is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")

    db.delete(produto_)
    db.commit()

    return {"ok": True}


def busca_produto_por_id(db: Session, produto_id: int):
    """ Função para buscar produto no banco de dados pelo seu ID. """

    produto_ = db.get(models.Produto, produto_id)

    if produto_ is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")

    return produto_


def busca_produto_por_descricao(db: Session, produto_desc: str):
    """ Função para buscar produto no banco de dados pelo seu nome. """

    produto_ = db.query(models.Produto).filter(models.Produto.descricao == produto_desc).first()

    if produto_ is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado.")

    return produto_


def busca_todos_produtos(db: Session, skip: int = 0, limit: int = 100):
    """ Função para buscar todos os produtos no banco de dados. """

    return db.query(models.Produto).order_by(models.Produto.id).offset(skip).limit(limit).all()
