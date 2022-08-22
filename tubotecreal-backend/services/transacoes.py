from fastapi import HTTPException
from sqlalchemy.orm import Session
import models, schemas


def insere_transacao(db: Session, transacao: schemas.TransacaoNova):
    """ Função para inserir um novo produto no banco de dados """

    transacao_nova = models.Transacao(**transacao.dict())

    db.add(transacao_nova)
    db.commit()
    db.refresh(transacao_nova)

    return transacao_nova


def atualiza_transacao(db: Session, transacao: schemas.TransacaoUpdate):
    """ Função para atualizar produto no banco de dados """

    transacao_ = db.get(models.Transacao, transacao.id)
    if transacao_ is None:
        raise HTTPException(status_code=404, detail="Transação não encontrado.")

    # atualiza os campos necessários
    for var, value in vars(transacao).items():
        setattr(transacao_, var, value) if value else None

    db.add(transacao_)
    db.commit()
    db.refresh(transacao_)
    return transacao_


def remove_transacao(db: Session, transacao_id: int):
    """ Função para atualizar produto no banco de dados """

    transacao_ = db.get(models.Transacao, transacao_id)
    if transacao_ is None:
        raise HTTPException(status_code=404, detail="Transação não encontrada.")

    db.delete(transacao_)
    db.commit()

    return {"ok": True}


def busca_transacao_por_id(db: Session, transacao_id: int):
    """ Função para buscar produto no banco de dados pelo seu ID. """

    transacao_ = db.get(models.Transacao, transacao_id)

    if transacao_ is None:
        raise HTTPException(status_code=404, detail="Transação não encontrada.")

    return transacao_


def busca_transacoes_por_status(db: Session, transacao_status: bool, skip: int = 0, limit: int = 100):
    """ Função para buscar produto no banco de dados pelo seu ID. """

    transacoes_pagas = db.query(
        models.Transacao).filter(models.Transacao.pago == transacao_status).order_by(
            models.Transacao.id).offset(skip).limit(limit).all()

    if transacoes_pagas is None:
        raise HTTPException(status_code=404, detail="Transação não encontrada.")

    return transacoes_pagas



def busca_todas_transacoes(db: Session, skip: int = 0, limit: int = 100):
    """ Função para buscar todas as transações no banco de dados. """

    return db.query(models.Transacao).order_by(
        models.Transacao.id).offset(skip).limit(limit).all()
