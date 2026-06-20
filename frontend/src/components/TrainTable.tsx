import type { Train } from "../types";

type TrainTableProps = {
  canManage: boolean;
  trains: Train[];
  onDelete: (train: Train) => void;
  onEdit: (train: Train) => void;
};

const formatDateTime = (value: string): string => {
  return new Intl.DateTimeFormat("uk-UA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

function TrainTable({ canManage, trains, onDelete, onEdit }: TrainTableProps) {
  return (
    <div className="table-responsive rounded border border-secondary">
      <table className="table table-dark table-striped table-hover align-middle app-table mb-0">
        <thead>
          <tr>
            <th scope="col">Train</th>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">Station</th>
            <th scope="col">Departure</th>
            <th scope="col">Arrival</th>
            {canManage && <th scope="col">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {trains.map((train) => (
            <tr key={train.id}>
              <td>{train.trainNumber}</td>
              <td>{train.fromStation}</td>
              <td>{train.toStation}</td>
              <td>{train.station}</td>
              <td>{formatDateTime(train.departureTime)}</td>
              <td>{formatDateTime(train.arrivalTime)}</td>
              {canManage && (
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-info btn-sm"
                      onClick={() => onEdit(train)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onDelete(train)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TrainTable;
