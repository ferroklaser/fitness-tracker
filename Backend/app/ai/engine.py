import os

from google import genai

from app.ai.prompts import SYSTEM_PROMPT, build_user_prompt


class AIEngineError(RuntimeError):
    pass


async def generate_progress_report(workouts: list[dict]) -> str:
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise AIEngineError("GEMINI_API_KEY is not configured.")

    client = genai.Client(api_key=api_key)
    model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    prompt = f"""
{SYSTEM_PROMPT}

{build_user_prompt(workouts)}
"""

    try:
        response = client.models.generate_content(model=model, contents=prompt)
        content = response.text

        if not content:
            raise AIEngineError("Gemini returned empty response.")

        return content.strip()

    except Exception as exc:
        raise AIEngineError(f"Gemini error: {exc}") from exc
