from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

import schemas
from services import produtos

router = APIRouter(
    prefix="/api/produtos",
    tags=["produtos"],
    responses={404: {
        "description": "Not found"
    }},
)


@router.post("/", response_model=schemas.Produto)
async def criar_produto(
    produto: schemas.ProdutoNovo,
    db: Session = Depends(get_db)):
    return produtos.insere_produto(db=db, produto=produto)


@router.put("/", response_model=schemas.ProdutoUpdate)
async def atualizar_produto(
    produto: schemas.ProdutoUpdate,
    db: Session = Depends(get_db)):
    return produtos.atualiza_produto(db=db, produto=produto)


@router.delete("/{produto}")
async def remover_produto(
    produto: int,
    db: Session = Depends(get_db)):
    return produtos.remove_produto(db=db, produto_id=produto)


@router.get("/all/", response_model=list[schemas.Produto])
def lista_produtos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)):
    all_produtos = produtos.busca_todos_produtos(db, skip=skip, limit=limit)
    return all_produtos


@router.get("/id/{produto_id}", response_model=schemas.Produto)
def busca_produto_id(produto_id: int, db: Session = Depends(get_db)):
    produto = produtos.busca_produto_por_id(db, produto_id=produto_id)
    return produto


@router.get("/desc/{produto_desc}", response_model=schemas.Produto)
def busca_produto_desc(produto_desc: str, db: Session = Depends(get_db)):
    produto = produtos.busca_produto_por_descricao(
        db,
        produto_desc=produto_desc)
    return produto