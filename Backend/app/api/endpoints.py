import logging
import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from supabase import Client, create_client

from app.ai.engine import AIEngineError, generate_progress_report

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["ai"])
security = HTTPBearer()


class InsightResponse(BaseModel):
    report: str


def get_supabase() -> Client:
    url = os.getenv("EXPO_PUBLIC_SUPABASE_URL")
    key = os.getenv("EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY")

    if not url or not key:
        raise HTTPException(
            status_code=500,
            detail="EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY is not configured.",
        )

    return create_client(url, key)


async def get_user_id_from_token(supabase: Client, token: str) -> str:
    try:
        user_response = supabase.auth.get_user(token)
    except Exception as exc:
        logger.error("Supabase get_user failed: %s", exc)
        raise HTTPException(status_code=401, detail=f"Invalid Supabase token: {exc}") from exc

    user = getattr(user_response, "user", None)
    user_id = getattr(user, "id", None)
    if not user_id:
        raise HTTPException(status_code=401, detail="Could not verify user.")

    return user_id


def fetch_recent_logs(supabase: Client, user_id: str) -> list[dict]:
    try:
        workouts = (
            supabase.table("workout_logs")
            .select("exercise_name, sets, reps, weight, created_at")
            .eq("user_id", user_id)
            .order("created_at", desc=True)
            .limit(20)
            .execute()
            .data
        )
    except Exception as exc:
        logger.error("Supabase workout_logs query failed: %s", exc)
        raise HTTPException(status_code=502, detail="Could not load workout logs.") from exc

    return workouts or []


def fetch_user_profile(supabase: Client, user_id: str) -> dict | None:
    try:
        result = (
            supabase.table("profiles")
            .select(
                "gender, age, weight, height, target_weight, body_fat, "
                "experience, activity_level, selected_goals, computed_calories"
            )
            .eq("user_id", user_id)
            .single()
            .execute()
        )
        return result.data
    except Exception as exc:
        logger.warning("Could not load profile for %s: %s", user_id, exc)
        return None


@router.post("/insights", response_model=InsightResponse)
async def create_insights(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> InsightResponse:
    supabase = get_supabase()
    token = credentials.credentials

    user_id = await get_user_id_from_token(supabase, token=token)
    supabase.postgrest.auth(token)

    workouts = fetch_recent_logs(supabase, user_id)
    profile = fetch_user_profile(supabase, user_id)

    logger.info("user_id=%s | workouts=%d | profile=%s", user_id, len(workouts), profile)

    if not workouts:
        return InsightResponse(
            report="Not enough workout data yet. Log some workouts first, then try again."
        )

    try:
        report = await generate_progress_report(workouts=workouts, profile=profile)
    except AIEngineError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        logger.error("Unexpected error generating report: %s", exc)
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return InsightResponse(report=report)
