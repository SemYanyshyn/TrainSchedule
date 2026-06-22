import { Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { RequestHandler } from "express";

import { signAuthToken } from "../lib/jwt";
import prisma from "../lib/prisma";
import { AuthenticatedRequest, AuthUserPayload } from "../types/auth";

const SALT_ROUNDS = 10;

type AuthRequestBody = {
  email?: unknown;
  password?: unknown;
};

const getAuthBody = (body: AuthRequestBody) => {
  const { email, password } = body;

  if (
    typeof email !== "string" ||
    email.trim().length === 0 ||
    typeof password !== "string" ||
    password.length === 0
  ) {
    return null;
  }

  return {
    email: email.trim().toLowerCase(),
    password,
  };
};

const toAuthUserPayload = (user: AuthUserPayload): AuthUserPayload => ({
  id: user.id,
  email: user.email,
  role: user.role,
});

export const register: RequestHandler = async (req, res) => {
  try {
    const authBody = getAuthBody(req.body);

    if (!authBody) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: authBody.email },
    });

    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }

    const passwordHash = await bcrypt.hash(authBody.password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email: authBody.email,
        passwordHash,
        role: Role.USER,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    const authUser = toAuthUserPayload(user);
    const token = signAuthToken(authUser);

    res.status(201).json({ token, user: authUser });
  } catch (error) {
    console.error("Register failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const authBody = getAuthBody(req.body);

    if (!authBody) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: authBody.email },
    });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      authBody.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const authUser = toAuthUserPayload({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const token = signAuthToken(authUser);

    res.json({ token, user: authUser });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMe: RequestHandler = (req, res) => {
  const { user } = req as AuthenticatedRequest;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.json({ user });
};
