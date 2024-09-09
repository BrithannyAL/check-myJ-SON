from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Origen que quieres permitir
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)

UPLOAD_DIR = "webservices/files"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return {"message": "Archivo subido exitosamente."}
    except Exception as e:
        return JSONResponse(content={"message": "Error al subir el archivo."}, status_code=500)

@app.get("/validate/")
async def validate_files():
    files_info = []
    for filename in os.listdir(UPLOAD_DIR):
        file_path = os.path.join(UPLOAD_DIR, filename)
        size = os.path.getsize(file_path) / (1024 * 1024)  # Tamaño en MB
        try:
            with open(file_path, "r") as f:
                json.load(f)
            validation = True
        except:
            validation = False
        files_info.append({"name": filename, "size": round(size, 3), "validation": validation})
    return files_info
