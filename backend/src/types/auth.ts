import { Role } from "@prisma/client";
import { Request } from "express";

export type AuthUserPayload = {
  id: number;
  email: string;
  role: Role;
};

export type AuthenticatedRequest = Request & {
  user?: AuthUserPayload;
};
