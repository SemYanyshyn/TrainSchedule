import type { AuthResponse, Train, TrainPayload } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

const getErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? "Request failed";
  } catch {
    return "Request failed";
  }
};

export const fetchTrains = async (): Promise<Train[]> => {
  const response = await fetch(`${API_URL}/trains`);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as Train[];
};

export const createTrain = async (
  token: string,
  data: TrainPayload,
): Promise<Train> => {
  const response = await fetch(`${API_URL}/trains`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as Train;
};

export const updateTrain = async (
  token: string,
  id: number,
  data: TrainPayload,
): Promise<Train> => {
  const response = await fetch(`${API_URL}/trains/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as Train;
};

export const deleteTrain = async (token: string, id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/trains/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
};

export const registerUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as AuthResponse;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as AuthResponse;
};
