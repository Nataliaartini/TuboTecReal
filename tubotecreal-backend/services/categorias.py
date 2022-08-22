from sqlalchemy.orm import Session
import models


def busca_todas_categorias(db: Session, skip: int = 0, limit: int = 100):
    """ Função para buscar todos as categorias de produtos no banco de dados. """

    return db.query(models.Categoria).offset(skip).limit(limit).all()
