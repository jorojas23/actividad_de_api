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
    ano_de_transmision : str
    ano_de_finalizacion: str
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
                    ano_de_transmision =  descarga_data['ano_de_transmision'],
                    ano_de_finalizacion =  descarga_data['ano_de_finalizacion'],
                    foto= descarga_data['foto'],
                )
                personajes.append(personaje)
                
cargar_descargas_desde_json("Series.json")                 

def guardar_series_en_json():
    with open("Series.json", "w") as file:
        json.dump([p.dict() for p in personajes], file, indent=4)

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

@app.post("/personajes/", response_model=Personaje)
async def crear_articulo(personaje: Personaje):
    personajes.append(personaje)
    try:
        guardar_series_en_json()
    except (IOError, OSError) as e:
        raise HTTPException(status_code=500, detail=f"Error al escribir en el archivo: {e}")
    return personaje
@app.delete("/personajes/{personaje_id}")
async def eliminar_articulo(personaje_id: int):
    
    serie_a_eliminar = next((serie for serie in personajes if serie.id == personaje_id), None) 
    if serie_a_eliminar is None:
        raise HTTPException(status_code=404, detail="Serie no encontrada")

    personajes.remove(serie_a_eliminar)
    try:
        guardar_series_en_json()
    except (IOError, OSError) as e:
        raise HTTPException(status_code=500, detail=f"Error al escribir en el archivo: {e}")
    return {"mensaje": "Artículo eliminado"}
@app.put("/personajes/{personaje_id}")
async def actualizar_serie(personaje_id: int, serie_actualizada: Personaje):
    # Buscar la serie por su ID
    serie_existente = next((serie for serie in personajes if serie.id == personaje_id), None)
    
    # Si no se encuentra la serie, lanzar un error 404
    if not serie_existente:
        raise HTTPException(status_code=404, detail="Serie no encontrada")

    # Actualizar los campos de la serie
    serie_existente.titulo = serie_actualizada.titulo
    serie_existente.foto = serie_actualizada.foto
    serie_existente.creador = serie_actualizada.creador
    serie_existente.cantidad_de_temporadas = serie_actualizada.cantidad_de_temporadas
    serie_existente.personajes_principales = serie_actualizada.personajes_principales
    serie_existente.valoracion = serie_actualizada.valoracion
    serie_existente.ano_de_transmision = serie_actualizada.ano_de_transmision
    serie_existente.ano_de_finalizacion = serie_actualizada.ano_de_finalizacion

    # Guardar los cambios en el archivo JSON
    try:
        guardar_series_en_json()
    except (IOError, OSError) as e:
        raise HTTPException(status_code=500, detail=f"Error al escribir en el archivo: {e}")

    return {"mensaje": "Serie actualizada correctamente", "serie": serie_existente}