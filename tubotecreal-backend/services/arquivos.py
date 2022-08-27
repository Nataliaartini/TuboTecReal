import os

import shutil
import models
import schemas
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

FILE_DIR = os.getenv("FILE_DIR", "app")


def insere_arquivo(db: Session, arquivo: schemas.ArquivoNovo, upload: UploadFile):
    """ Função para inserir um novo arquivo no banco de dados """

    filename, extension = upload.filename.split('.')

    localizacao = f"{FILE_DIR}/{upload.filename}"
    arquivo_duplicado = True
    count = 1

    while arquivo_duplicado:
        if os.path.exists(localizacao):
            localizacao = f"{FILE_DIR}/{filename} ({count}).{extension}"
            count += 1
        else:
            arquivo_duplicado = False

    with open(localizacao, "wb") as buffer:
        shutil.copyfileobj(upload.file, buffer)

    arquivo_novo = models.Arquivo(**arquivo.dict())
    arquivo_novo.localizacao = localizacao
    arquivo_novo.nome = upload.filename
    arquivo_novo.tipo_midia = upload.content_type

    db.add(arquivo_novo)
    db.commit()
    db.refresh(arquivo_novo)

    return arquivo_novo


def atualiza_arquivo(db: Session, arquivo: schemas.ArquivoUpdate):
    """ Função para atualizar produto no banco de dados """

    arquivo_ = db.get(models.Arquivo, arquivo.id)
    if arquivo_ is None:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado.")

    # atualiza os campos necessários
    for var, value in vars(arquivo).items():
        setattr(arquivo_, var, value) if value else None

    db.add(arquivo_)
    db.commit()
    db.refresh(arquivo_)
    return arquivo_


def remove_arquivo(db: Session, arquivo_id: int):
    """ Função para remover um produto do banco de dados """

    arquivo_ = db.get(models.Arquivo, arquivo_id)
    if arquivo_ is None:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado.")

    try:
        os.remove(arquivo_.localizacao)
        db.delete(arquivo_)
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=404, detail="Arquivo não pode ser removido.")

    return {"ok": True}


def busca_arquivo_por_id(db: Session, arquivo_id: int):
    """ Função para buscar produto no banco de dados pelo seu ID. """

    arquivo_ = db.get(models.Arquivo, arquivo_id)

    if arquivo_ is None:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado.")

    return arquivo_


def busca_todos_arquivos(db: Session, skip: int = 0, limit: int = 100):
    """ Função para buscar todos os arquivos no banco de dados. """

    return db.query(models.Arquivo).order_by(models.Arquivo.id).offset(skip).limit(limit).all()
