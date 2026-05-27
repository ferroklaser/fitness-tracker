import os

from openai import AsyncOpenAI

from app.ai.prompts import SYSTEM_PROMPT, build_user_prompt


class AIEngineError(RuntimeError):
    pass


async def generate_progress_report(
    workouts: list[dict],
    calories: list[dict],
) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise AIEngineError("OPENAI_API_KEY is not configured.")

    client = AsyncOpenAI(api_key=api_key)
    model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    response = await client.chat.completions.create(
        model=model,
        temperature=0.4,
        max_tokens=500,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(workouts, calories)},
        ],
    )

    content = response.choices[0].message.content
    if not content:
        raise AIEngineError("OpenAI returned an empty response.")

    return content.strip()
