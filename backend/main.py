from fastapi import FastAPI

app = FastAPI(title="AI-Powered Data Analysis Assistant")

@app.get("/")
def health_check():
    return {"status": "Backend is running"}
