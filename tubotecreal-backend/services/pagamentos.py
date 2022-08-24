from sqlalchemy.orm import Session
import models


def busca_todos_tipos_pagamento(db: Session, skip: int = 0, limit: int = 100):
    """ Função para buscar todas as moedas no banco de dados. """

    return db.query(models.TipoPagamento).offset(skip).limit(limit).all()
