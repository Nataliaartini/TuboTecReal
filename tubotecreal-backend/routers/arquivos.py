from fastapi import UploadFile, File
from database import get_db
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import schemas
from services import arquivos

router = APIRouter(
    prefix="/api/arquivos",
    tags=["arquivos"],
    responses={404: {
        "description": "Not found"
    }},
)


@router.post("/", response_model=schemas.Arquivo)
def criar_arquivo(
        arquivo: schemas.ArquivoNovo = Depends(),
        upload: UploadFile = File(...),
        db: Session = Depends(get_db)):
    return arquivos.insere_arquivo(db, arquivo=arquivo, upload=upload)


@router.put("/", response_model=schemas.Arquivo)
def atualizar_arquivo(
        arquivo: schemas.ArquivoUpdate,
        db: Session = Depends(get_db)):
    return arquivos.atualiza_arquivo(db, arquivo=arquivo)


@router.delete("/{arquivo_id}")
def remover_arquivo(
        arquivo_id: int,
        db: Session = Depends(get_db)):
    return arquivos.remove_arquivo(db, arquivo_id=arquivo_id)


@router.get("/id/{arquivo_id}")
def download_arquivo(
        arquivo_id: int,
        db: Session = Depends(get_db)):
    arquivo = arquivos.busca_arquivo_por_id(db=db, arquivo_id=arquivo_id)
    print(arquivo)
    return FileResponse(path=arquivo.localizacao, filename=arquivo.nome, media_type=arquivo.tipo_midia)


@router.get("/all/", response_model=list[schemas.Arquivo])
def lista_arquivos(
        skip: int = 0,
        limit: int = 100,
        db: Session = Depends(get_db)):
    all_arquivos = arquivos.busca_todos_arquivos(db, skip=skip, limit=limit)
    return all_arquivos
