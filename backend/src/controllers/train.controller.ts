import { RequestHandler } from "express";

import prisma from "../lib/prisma";

type TrainRequestBody = {
  trainNumber?: unknown;
  fromStation?: unknown;
  toStation?: unknown;
  station?: unknown;
  departureTime?: unknown;
  arrivalTime?: unknown;
};

type TrainData = {
  trainNumber: string;
  fromStation: string;
  toStation: string;
  station: string;
  departureTime: Date;
  arrivalTime: Date;
};

const parseTrainId = (id: string): number | null => {
  const trainId = Number(id);

  if (!Number.isInteger(trainId) || trainId <= 0) {
    return null;
  }

  return trainId;
};

const parseDate = (value: unknown): Date | null => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const getRequiredString = (value: unknown): string | null => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  return value.trim();
};

const parseTrainBody = (body: TrainRequestBody): TrainData | null => {
  const trainNumber = getRequiredString(body.trainNumber);
  const fromStation = getRequiredString(body.fromStation);
  const toStation = getRequiredString(body.toStation);
  const station = getRequiredString(body.station);
  const departureTime = parseDate(body.departureTime);
  const arrivalTime = parseDate(body.arrivalTime);

  if (
    !trainNumber ||
    !fromStation ||
    !toStation ||
    !station ||
    !departureTime ||
    !arrivalTime
  ) {
    return null;
  }

  return {
    trainNumber,
    fromStation,
    toStation,
    station,
    departureTime,
    arrivalTime,
  };
};

export const getTrains: RequestHandler = async (_req, res) => {
  try {
    const trains = await prisma.train.findMany({
      orderBy: {
        departureTime: "asc",
      },
    });

    res.json(trains);
  } catch (error) {
    console.error("Get trains failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTrain: RequestHandler = async (req, res) => {
  try {
    const trainData = parseTrainBody(req.body);

    if (!trainData) {
      res.status(400).json({ message: "All train fields are required" });
      return;
    }

    const train = await prisma.train.create({
      data: trainData,
    });

    res.status(201).json(train);
  } catch (error) {
    console.error("Create train failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTrain: RequestHandler = async (req, res) => {
  try {
    const trainId = parseTrainId(req.params.id);

    if (!trainId) {
      res.status(400).json({ message: "Invalid train id" });
      return;
    }

    const trainData = parseTrainBody(req.body);

    if (!trainData) {
      res.status(400).json({ message: "All train fields are required" });
      return;
    }

    const existingTrain = await prisma.train.findUnique({
      where: { id: trainId },
    });

    if (!existingTrain) {
      res.status(404).json({ message: "Train not found" });
      return;
    }

    const train = await prisma.train.update({
      where: { id: trainId },
      data: trainData,
    });

    res.json(train);
  } catch (error) {
    console.error("Update train failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTrain: RequestHandler = async (req, res) => {
  try {
    const trainId = parseTrainId(req.params.id);

    if (!trainId) {
      res.status(400).json({ message: "Invalid train id" });
      return;
    }

    const existingTrain = await prisma.train.findUnique({
      where: { id: trainId },
    });

    if (!existingTrain) {
      res.status(404).json({ message: "Train not found" });
      return;
    }

    await prisma.train.delete({
      where: { id: trainId },
    });

    res.json({ message: "Train deleted successfully" });
  } catch (error) {
    console.error("Delete train failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
