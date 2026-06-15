import os

from google import genai

from app.ai.prompts import SYSTEM_PROMPT, build_user_prompt


class AIEngineError(RuntimeError):
    pass


async def generate_progress_report(
    workouts: list[dict],
    profile: dict | None = None,
) -> str:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise AIEngineError("GEMINI_API_KEY is not configured.")

    client = genai.Client(api_key=api_key)
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    prompt = f"""
{SYSTEM_PROMPT}

{build_user_prompt(workouts, profile)}
"""

    try:
        response = client.models.generate_content(
            model=model,
            contents=prompt,
        )
        content = response.text

        if not content:
            raise AIEngineError("Gemini returned empty response.")

        return content.strip()

    except AIEngineError:
        raise
    except Exception as exc:
        err_str = str(exc)
        if "503" in err_str or "UNAVAILABLE" in err_str:
            raise AIEngineError(
                "The AI service is temporarily busy. Please try again in a moment."
            ) from exc
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
            raise AIEngineError(
                "AI quota reached for today. Please try again tomorrow."
            ) from exc
        if "401" in err_str or "API_KEY" in err_str:
            raise AIEngineError(
                "AI service authentication failed. Please contact support."
            ) from exc
        raise AIEngineError("Failed to generate report. Please try again.") from exc