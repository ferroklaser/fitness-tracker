from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import router as api_router


# Run with `uvicorn main:app --reload`

load_dotenv()

app = FastAPI(title="FitnessTrack AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
async def root():
    return {"message": "FitnessTrack AI Backend is running"}

@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
