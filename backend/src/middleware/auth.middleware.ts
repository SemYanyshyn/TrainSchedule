import { RequestHandler } from "express";

import { verifyAuthToken } from "../lib/jwt";
import { AuthenticatedRequest } from "../types/auth";

export const authenticate: RequestHandler = (req, res, next) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    (req as AuthenticatedRequest).user = verifyAuthToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

