from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

import schemas
from services import origens

router = APIRouter(
    prefix="/api/origens",
    tags=["origens"],
    responses={404: {
        "description": "Not found"
    }},
)


@router.get("/all/", response_model=list[schemas.Origem])
def lista_origens(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)):
    origens_ = origens.busca_todas_origens(db, skip=skip, limit=limit)
    return origens_