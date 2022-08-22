from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

import schemas
from services import transacoes

router = APIRouter(
    prefix="/api/transacoes",
    tags=["origtransacoesns"],
    responses={404: {
        "description": "Not found"
    }},
)

@router.post("/", response_model=schemas.Transacao)
async def criar_transacao(
    transacao: schemas.TransacaoNova,
    db: Session = Depends(get_db)):
    return transacoes.insere_transacao(db=db, transacao=transacao)

@router.put("/", response_model=schemas.Transacao)
async def atualizar_transacao(
    transacao: schemas.TransacaoUpdate,
    db: Session = Depends(get_db)):
    return transacoes.atualiza_transacao(db=db, transacao=transacao)

@router.delete("/{transacao_id}")
async def remover_transacao(
    transacao_id: int,
    db: Session = Depends(get_db)):
    return transacoes.remove_transacao(db=db, transacao_id=transacao_id)


@router.get("/id/{transacao_id}", response_model=schemas.Transacao)
def busca_transacao_id(transacao_id: int, db: Session = Depends(get_db)):
    transacao_ = transacoes.busca_transacao_por_id(db, transacao_id=transacao_id)
    for var, value in vars(transacao_).items():
        print(var, value)
    return transacao_


@router.get("/status/{transacao_status}", response_model=list[schemas.Transacao])
def busca_transacoes_por_status(transacao_status: int, db: Session = Depends(get_db)):
    transacao_status = True if transacao_status > 0 else False
    transacao_ = transacoes.busca_transacoes_por_status(db, transacao_status=transacao_status)
    return transacao_


@router.get("/all/", response_model=list[schemas.Transacao])
def lista_transacoes(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)):
    lista_transacoes = transacoes.busca_todas_transacoes(db, skip=skip, limit=limit)
    return lista_transacoes