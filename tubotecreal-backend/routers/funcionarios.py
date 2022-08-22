from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

import schemas
from services import funcionarios

router = APIRouter(
    prefix="/api/funcionarios",
    tags=["funcionario"],
    responses={404: {
        "description": "Not found"
    }},
)

@router.post("/", response_model=schemas.Funcionario)
async def criar_funcionario(
    funcionario: schemas.Funcionario,
    db: Session = Depends(get_db)):
    print(funcionario)
    return funcionarios.insere_funcionario(db=db, funcionario=funcionario)

@router.put("/", response_model=schemas.Funcionario)
async def atualiza_funcionario(
    funcionario: schemas.Funcionario,
    db: Session = Depends(get_db)):
    print(funcionario)
    return funcionarios.atualiza_funcionario(db=db, funcionario=funcionario)

@router.delete("/{cpf}", response_model=schemas.Funcionario)
async def remove_funcionario(
    cpf: str,
    db: Session = Depends(get_db)):
    return funcionarios.remove_funcionario(db=db, cpf=cpf)


@router.get("/all/", response_model=list[schemas.Funcionario])
def lista_funcionarios(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)):
    funcionarios_ = funcionarios.busca_todos_funcionarios(db, skip=skip, limit=limit)
    return funcionarios_


@router.get("/cpf/{cpf}", response_model=schemas.Funcionario)
def busca_funcionario_cpf(
    cpf: str,
    db: Session = Depends(get_db)):
    funcionario = funcionarios.busca_funcionario_por_cpf(db, cpf=cpf)
    return funcionario


@router.get("/nome/{nome}", response_model=schemas.Funcionario)
def busca_funcionario_nome(
    nome: str,
    db: Session = Depends(get_db)):
    funcionario = funcionarios.busca_funcionario_por_nome(db, nome=nome)
    return funcionario