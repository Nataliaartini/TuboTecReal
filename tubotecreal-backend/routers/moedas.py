from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

import schemas
from services import moedas

router = APIRouter(
    prefix="/api/moedas",
    tags=["moedas"],
    responses={404: {
        "description": "Not found"
    }},
)


@router.get("/all/", response_model=list[schemas.Moeda])
def lista_moedas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)):
    all_moedas = moedas.busca_todas_moedas(db, skip=skip, limit=limit)
    return all_moedas