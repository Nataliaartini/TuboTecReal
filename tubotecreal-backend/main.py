from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
from models import Base
from routers import produtos, funcionarios, origens, categorias, pagamentos, transacoes, arquivos

Base.metadata.create_all(bind=engine)


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(arquivos.router)
app.include_router(categorias.router)
app.include_router(funcionarios.router)
app.include_router(pagamentos.router)
app.include_router(produtos.router)
app.include_router(origens.router)
app.include_router(transacoes.router)
