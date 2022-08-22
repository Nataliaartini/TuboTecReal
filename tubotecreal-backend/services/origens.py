from sqlalchemy.orm import Session
import models


def busca_todas_origens(db: Session, skip: int = 0, limit: int = 100):
    """ Função para buscar todos os produtos no banco de dados. """

    return db.query(models.Origem).offset(skip).limit(limit).all()