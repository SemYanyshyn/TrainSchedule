import { FormEvent, useEffect, useState } from "react";

import type { Train, TrainPayload } from "../types";

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
    <div className="card app-card border-secondary shadow mb-4">
      <div className="card-body">
        <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mb-3">
          <h2 className="h4 mb-0 text-light">
            {editingTrain ? "Edit Train" : "Create Train"}
          </h2>
          {editingTrain && (
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => {
                onCancelEdit();
                setValues(emptyFormValues);
              }}
              type="button"
            >
              Cancel edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label text-light" htmlFor="trainNumber">
                Train number
              </label>
              <input
                className="form-control"
                id="trainNumber"
                onChange={(event) =>
                  updateField("trainNumber", event.target.value)
                }
                required
                value={values.trainNumber}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-light" htmlFor="fromStation">
                From
              </label>
              <select
                className="form-select"
                id="fromStation"
                onChange={(event) =>
                  updateField("fromStation", event.target.value)
                }
                required
                value={values.fromStation}
              >
                {directionStationOptions.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-light" htmlFor="toStation">
                To
              </label>
              <select
                className="form-select"
                id="toStation"
                onChange={(event) =>
                  updateField("toStation", event.target.value)
                }
                required
                value={values.toStation}
              >
                {directionStationOptions.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-light" htmlFor="station">
                Station
              </label>
              <select
                className="form-select"
                id="station"
                onChange={(event) => updateField("station", event.target.value)}
                required
                value={values.station}
              >
                {stationOptions.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-light" htmlFor="departureTime">
                Departure time
              </label>
              <input
                className="form-control"
                id="departureTime"
                onChange={(event) =>
                  updateField("departureTime", event.target.value)
                }
                required
                type="datetime-local"
                value={values.departureTime}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-light" htmlFor="arrivalTime">
                Arrival time
              </label>
              <input
                className="form-control"
                id="arrivalTime"
                onChange={(event) =>
                  updateField("arrivalTime", event.target.value)
                }
                required
                type="datetime-local"
                value={values.arrivalTime}
              />
            </div>

            <div className="col-12 d-flex gap-2">
              <button
                className="btn btn-success"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting
                  ? "Saving..."
                  : editingTrain
                    ? "Update train"
                    : "Create train"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TrainForm;
