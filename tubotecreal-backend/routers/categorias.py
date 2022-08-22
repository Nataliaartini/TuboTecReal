from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

import schemas
from services import categorias

router = APIRouter(
    prefix="/api/categorias",
    tags=["categorias"],
    responses={404: {
        "description": "Not found"
    }},
)


@router.get("/all/", response_model=list[schemas.Categoria])
def lista_origens(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)):
    all_categorias = categorias.busca_todas_categorias(db, skip=skip, limit=limit)
    return all_categorias