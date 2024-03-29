import schemas
from database import get_db
from fastapi import APIRouter, Depends
from services import pagamentos
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/api/pagamentos",
    tags=["pagamentos"],
    responses={404: {
        "description": "Not found"
    }},
)


@router.get("/all/", response_model=list[schemas.TipoPagamento])
def lista_tipos_pagamento(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db)):
    all_pagamentos = pagamentos.busca_todos_tipos_pagamento(db, skip=skip, limit=limit)
    return all_pagamentos
