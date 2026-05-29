import os
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from supabase import Client, create_client

from app.ai.engine import AIEngineError, generate_progress_report


router = APIRouter(prefix="/api", tags=["ai"])
security = HTTPBearer()


class InsightResponse(BaseModel):
    report: str


def get_supabase_admin() -> Client:
    url = os.getenv("SUPABASE_URL")
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not service_key:
        raise HTTPException(
            status_code=500,
            detail="SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured.",
        )

    return create_client(url, service_key)


async def get_user_id_from_token(
    supabase: Client,
    # authorization: str | None,
    token: str,
) -> str:
    try:
        user_response = supabase.auth.get_user(token)
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid Supabase token.") from exc

    user = getattr(user_response, "user", None)
    user_id = getattr(user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Could not verify user.")

    return user_id


def fetch_recent_logs(supabase: Client, user_id: str) -> tuple[list[dict], list[dict]]:
    try:
        workouts = (
            supabase.table("workout_logs")
             .select("activity_type, data, created_at")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(20)
            .execute()
            .data
        )

        calories = (
            supabase.table("calorie_logs")
            .select("calories, log_date, created_at")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(14)
            .execute()
            .data
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail="Could not load Supabase logs.") from exc

    return workouts or [], calories or []


@router.post("/insights", response_model=InsightResponse)
async def create_insights(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> InsightResponse:
    supabase = get_supabase_admin()
    
    user_id = await get_user_id_from_token(supabase, credentials.credentials)
    workouts, calories = fetch_recent_logs(supabase, user_id)

    try:
        report = await generate_progress_report(workouts=workouts, calories=calories)
    except AIEngineError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        # raise HTTPException(status_code=502, detail="Could not generate AI report.") from exc
        print(exc)
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return InsightResponse(report=report)
