import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Train, TrainPayload } from "@/types";

const directionStationOptions = ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro"];

const stationOptions = [
  "Kyiv Central",
  "Lviv Main",
  "Odesa-Holovna",
  "Kharkiv-Pasazhyrskyi",
  "Dnipro-Holovnyi",
];

type TrainFormValues = {
  trainNumber: string;
  fromStation: string;
  toStation: string;
  station: string;
  departureTime: string;
  arrivalTime: string;
};

type TrainFormProps = {
  editingTrain: Train | null;
  isSubmitting: boolean;
  onCancelEdit: () => void;
  onSubmit: (data: TrainPayload) => Promise<void>;
};

const emptyFormValues: TrainFormValues = {
  trainNumber: "",
  fromStation: directionStationOptions[0],
  toStation: directionStationOptions[1],
  station: stationOptions[0],
  departureTime: "",
  arrivalTime: "",
};

const toDateTimeLocalValue = (value: string): string => {
  const date = new Date(value);
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 16);
};

const getInitialValues = (train: Train | null): TrainFormValues => {
  if (!train) {
    return emptyFormValues;
  }

  return {
    trainNumber: train.trainNumber,
    fromStation: train.fromStation,
    toStation: train.toStation,
    station: train.station,
    departureTime: toDateTimeLocalValue(train.departureTime),
    arrivalTime: toDateTimeLocalValue(train.arrivalTime),
  };
};

function TrainForm({
  editingTrain,
  isSubmitting,
  onCancelEdit,
  onSubmit,
}: TrainFormProps) {
  const [values, setValues] = useState<TrainFormValues>(() =>
    getInitialValues(editingTrain),
  );

  useEffect(() => {
    setValues(getInitialValues(editingTrain));
  }, [editingTrain]);

  const updateField = (field: keyof TrainFormValues, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      trainNumber: values.trainNumber.trim(),
      fromStation: values.fromStation,
      toStation: values.toStation,
      station: values.station,
      departureTime: new Date(values.departureTime).toISOString(),
      arrivalTime: new Date(values.arrivalTime).toISOString(),
    });

    setValues(emptyFormValues);
  };

  return (
    <Card className="border-slate-700 bg-slate-900/80 shadow-xl shadow-black/20">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>{editingTrain ? "Edit Train" : "Create Train"}</CardTitle>
          <CardDescription>
            {editingTrain
              ? "Update the selected train record."
              : "Add a new train record to the schedule."}
          </CardDescription>
        </div>
        {editingTrain && (
          <Button
            onClick={() => {
              onCancelEdit();
              setValues(emptyFormValues);
            }}
            type="button"
            variant="outline"
          >
            Cancel edit
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="trainNumber">Train number</Label>
              <Input
                id="trainNumber"
                onChange={(event) =>
                  updateField("trainNumber", event.target.value)
                }
                required
                value={values.trainNumber}
              />
            </div>

            <div className="space-y-2">
              <Label>From</Label>
              <Select
                onValueChange={(value) => updateField("fromStation", value)}
                required
                value={values.fromStation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select origin" />
                </SelectTrigger>
                <SelectContent>
                  {directionStationOptions.map((station) => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Select
                onValueChange={(value) => updateField("toStation", value)}
                required
                value={values.toStation}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  {directionStationOptions.map((station) => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Station</Label>
              <Select
                onValueChange={(value) => updateField("station", value)}
                required
                value={values.station}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select station" />
                </SelectTrigger>
                <SelectContent>
                  {stationOptions.map((station) => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departureTime">Departure time</Label>
              <Input
                id="departureTime"
                onChange={(event) =>
                  updateField("departureTime", event.target.value)
                }
                required
                type="datetime-local"
                value={values.departureTime}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="arrivalTime">Arrival time</Label>
              <Input
                id="arrivalTime"
                onChange={(event) =>
                  updateField("arrivalTime", event.target.value)
                }
                required
                type="datetime-local"
                value={values.arrivalTime}
              />
            </div>
          </div>

          <Button disabled={isSubmitting} type="submit">
            {isSubmitting
              ? "Saving..."
              : editingTrain
                ? "Update train"
                : "Create train"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default TrainForm;
