from fastapi import FastAPI, UploadFile, File
import pandas as pd

from data_analysis import basic_analysis

app = FastAPI(title="AI-Powered Data Analysis Assistant")

@app.get("/")
def health_check():
    return {"status": "Backend is running"}

@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        return {"error": "Only CSV files are supported"}

    df = pd.read_csv(file.file, encoding="ISO-8859-1")
    result = basic_analysis(df)

    return result
