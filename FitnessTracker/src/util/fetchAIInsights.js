import { supabase } from "../lib/supabase"

const BACKEND_URL = "http://127.0.0.1:8000"

export async function fetchAIInsights() {
    const {
        data: sessionData,
        error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !sessionData?.session) {
        throw new Error("User session not found. Please login again.")
    }

    const token = sessionData.session.access_token

    const response = await fetch(`${BACKEND_URL}/api/insights`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })

    const json = await response.json()

    if (!response.ok) {
        throw new Error(json.detail || "Failed to generate report.")
    }

    return json
}
