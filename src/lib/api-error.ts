import { NextResponse } from "next/server";

export function apiError(
  message: string,
  status: number,
  details?: unknown
) {
  return NextResponse.json(
    { error: message, ...(details ? { details } : {}) },
    { status }
  );
}

export function unauthorized(message = "Authentication required") {
  return apiError(message, 401);
}

export function forbidden(message = "Access denied") {
  return apiError(message, 403);
}

export function notFoundError(message = "Resource not found") {
  return apiError(message, 404);
}

export function badRequest(message: string, details?: unknown) {
  return apiError(message, 400, details);
}

export function conflict(message: string) {
  return apiError(message, 409);
}
