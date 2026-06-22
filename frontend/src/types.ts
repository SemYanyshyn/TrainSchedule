export type Role = "USER" | "ADMIN";

export type AuthUser = {
  id: number;
  email: string;
  role: Role;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type Train = {
  id: number;
  trainNumber: string;
  fromStation: string;
  toStation: string;
  station: string;
  departureTime: string;
  arrivalTime: string;
  createdAt: string;
  updatedAt: string;
};

export type TrainPayload = {
  trainNumber: string;
  fromStation: string;
  toStation: string;
  station: string;
  departureTime: string;
  arrivalTime: string;
};
