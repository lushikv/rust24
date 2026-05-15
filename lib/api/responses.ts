import { NextResponse } from "next/server";

export function apiError(message: string, status = 500, code = "API_ERROR") {
  return NextResponse.json({ error: message, code }, { status });
}

export function apiRateLimited() {
  return apiError("Too many requests.", 429, "RATE_LIMITED");
}
