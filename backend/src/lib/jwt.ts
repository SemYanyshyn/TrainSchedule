import { Role } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

import { AuthUserPayload } from "../types/auth";

const TOKEN_EXPIRES_IN = "7d";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

export const signAuthToken = (payload: AuthUserPayload): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_EXPIRES_IN });
};

const isAuthUserPayload = (
  payload: string | JwtPayload,
): payload is AuthUserPayload => {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  return (
    typeof payload.id === "number" &&
    typeof payload.email === "string" &&
    (payload.role === Role.USER || payload.role === Role.ADMIN)
  );
};

export const verifyAuthToken = (token: string): AuthUserPayload => {
  const payload = jwt.verify(token, getJwtSecret());

  if (!isAuthUserPayload(payload)) {
    throw new Error("Invalid token payload");
  }

  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };
};

