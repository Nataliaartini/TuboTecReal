import models
import schemas
from fastapi import HTTPException
from sqlalchemy.orm import Session


def insere_funcionario(db: Session, funcionario: schemas.Funcionario):
    """ Função para inserir um novo funcionario no banco de dados """

    funcionario_novo = models.Funcionario(**funcionario.dict())

    db.add(funcionario_novo)
    db.commit()
    db.refresh(funcionario_novo)

    return funcionario_novo


def atualiza_funcionario(db: Session, funcionario: schemas.Funcionario):
    """ Função para atualizar produto no banco de dados """

    funcionario_ = db.get(models.Funcionario, funcionario.cpf)
    if funcionario_ is None:
        raise HTTPException(
            status_code=404,
            detail="Funcionário não encontrado.")

    # atualiza os campos necessários
    for var, value in vars(funcionario).items():
        setattr(funcionario_, var, value) if value else None

    db.add(funcionario_)
    db.commit()
    db.refresh(funcionario_)
    return funcionario_


def remove_funcionario(db: Session, cpf: str):
    """ Função para remover um produto do banco de dados """

    funcionario_ = db.get(models.Funcionario, cpf)
    if funcionario_ is None:
        raise HTTPException(
            status_code=404,
            detail="Funcionário não encontrado.")

    db.delete(funcionario_)
    db.commit()

    return {"ok": True}


def busca_funcionario_por_cpf(db: Session, cpf: str):
    """ Função para buscar produto no banco de dados pelo seu cpf. """

    funcionario_ = db.query(
        models.Funcionario).filter(models.Funcionario.cpf == cpf).first()

    if funcionario_ is None:
        raise HTTPException(
            status_code=404,
            detail="Funcionario não encontrado.")

    return funcionario_


def busca_funcionario_por_nome(db: Session, nome: str):
    """ Função para buscar funcionario no banco de dados pelo seu nome. """

    funcionario_ = db.query(
        models.Funcionario).filter(models.Funcionario.nome == nome).first()

    if funcionario_ is None:
        raise HTTPException(
            status_code=404,
            detail="Funcionario não encontrado.")

    return funcionario_


def busca_todos_funcionarios(db: Session, skip: int = 0, limit: int = 100):
    """ Função para buscar todos os funcionarios no banco de dados. """

    return db.query(models.Funcionario).offset(skip).limit(limit).all()
