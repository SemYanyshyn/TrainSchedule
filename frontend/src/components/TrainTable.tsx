import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Train } from "@/types";

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

function TrainTable({ canManage, onDelete, onEdit, trains }: TrainTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-700">
      <Table>
        <TableHeader className="bg-slate-950/70">
          <TableRow className="border-slate-700 hover:bg-slate-950/70">
            <TableHead>Train</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>Departure</TableHead>
            <TableHead>Arrival</TableHead>
            {canManage && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {trains.map((train) => (
            <TableRow
              className="border-slate-800 hover:bg-slate-800/70"
              key={train.id}
            >
              <TableCell className="font-medium text-white">
                {train.trainNumber}
              </TableCell>
              <TableCell>{train.fromStation}</TableCell>
              <TableCell>{train.toStation}</TableCell>
              <TableCell>{train.station}</TableCell>
              <TableCell>{formatDateTime(train.departureTime)}</TableCell>
              <TableCell>{formatDateTime(train.arrivalTime)}</TableCell>
              {canManage && (
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => onEdit(train)}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => onDelete(train)}
                      size="sm"
                      type="button"
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default TrainTable;
