from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
from typing import List

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1:8000",
    "http://127.0.0.1",
    "null"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Personaje(BaseModel):
    id: int
    titulo: str
    creador: str
    cantidad_de_temporadas: int
    personajes_principales: list
    valoracion: str
    año_de_transmision : str
    año_de_finalizacion: str
    foto: str

personajes = []
def cargar_descargas_desde_json(archivo_json):
        with open(archivo_json, 'r') as file:
            datos = json.load(file)
            for descarga_data in datos:
                personaje = Personaje(
                    id = descarga_data["id"],
                    titulo= descarga_data['titulo'],
                    creador= descarga_data['creador'],
                    cantidad_de_temporadas =  descarga_data['cantidad_de_temporadas'],
                    personajes_principales =  descarga_data['personajes_principales'],
                    valoracion = descarga_data['valoracion'],
                    año_de_transmision =  descarga_data['ano_de_transmision'],
                    año_de_finalizacion =  descarga_data['ano_de_finalizacion'],
                    foto= descarga_data['foto'],
                )
                personajes.append(personaje)
                
cargar_descargas_desde_json("Series.json")                 

@app.get("/")
async def root():
    return {"message": "¡Hola, FastAPI!"}

@app.get("/personajes/", response_model=List[Personaje])
async def obtener_personajes():
    return personajes

@app.get("/personajes/{personaje_id}", response_model=Personaje)
async def obtener_personaje(personaje_id: int):
    personaje = next((p for p in personajes if p.id == personaje_id), None)
    if personaje is None:
        raise HTTPException(status_code=404, detail="Personaje no encontrado")
    return personaje


    