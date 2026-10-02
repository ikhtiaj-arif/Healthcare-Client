"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { useDeleteSchedule, usePublishSchedule } from "@/hooks";
import type { Schedule } from "@/types";
import { getApiErrorMessage } from "@/utils";
import { ScheduleEditDialog } from "./schedule-edit-dialog";
import ScheduleDetailSheet from "./schedule-detail-sheet";

interface Props {
  schedules: Schedule[];
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function ScheduleTable({ schedules }: Props) {
  const { mutate: publish } = usePublishSchedule();
  const { mutate: remove } = useDeleteSchedule();

  const [viewing, setViewing] = useState<Schedule | null>(null);
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [deleting, setDeleting] = useState<Schedule | null>(null);
  // Tracked per row so one schedule's action doesn't disable every other row.
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handlePublish = (schedule: Schedule) => {
    setPublishingId(schedule.id);
    publish(schedule.id, {
      onSuccess: () => {
        toast.add({
          title: "Schedule published",
          description: "Patients can now book slots on this schedule.",
          type: "success",
        });
      },
      onError: (error) => {
        toast.add({
          title: "Publish failed",
          description: getApiErrorMessage(
            error,
            "We couldn't publish this schedule.",
          ),
          type: "error",
        });
      },
      onSettled: () => setPublishingId(null),
    });
  };

  const confirmDelete = () => {
    if (!deleting) return;

    setDeletingId(deleting.id);
    remove(deleting.id, {
      onSuccess: () => {
        toast.add({
          title: "Schedule deleted",
          description: "The schedule and its slots are no longer available.",
          type: "success",
        });
        setDeleting(null);
      },
      onError: (error) => {
        toast.add({
          title: "Delete failed",
          description: getApiErrorMessage(
            error,
            "We couldn't delete this schedule.",
          ),
          type: "error",
        });
      },
      onSettled: () => setDeletingId(null),
    });
  };

  if (schedules.length === 0) {
    return (
      <div className="rounded-lg border p-10 text-center text-sm text-muted-foreground">
        No schedules found. Create your first schedule to start accepting
        appointments.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date &amp; Time</TableHead>
              <TableHead>Slots</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>
                  <div className="font-medium">
                    {formatDateTime(schedule.startDateTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    to {formatDateTime(schedule.endDateTime)}
                  </div>
                </TableCell>
                <TableCell>
                  {schedule.totalSlots - schedule.availableSlots}/
                  {schedule.totalSlots} booked
                </TableCell>
                <TableCell>
                  <span
                    className={
                      schedule.status === "PUBLISHED"
                        ? "text-green-600"
                        : "text-amber-600"
                    }
                  >
                    {schedule.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewing(schedule)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditing(schedule)}
                    >
                      Edit
                    </Button>
                    {schedule.status === "DRAFT" && (
                      <Button
                        size="sm"
                        disabled={publishingId === schedule.id}
                        aria-busy={publishingId === schedule.id}
                        onClick={() => handlePublish(schedule)}
                      >
                        Publish
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setDeleting(schedule)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ScheduleEditDialog
        key={editing?.id ?? "closed"}
        schedule={editing}
        onClose={() => setEditing(null)}
      />

      {viewing && (
        <ScheduleDetailSheet
          schedule={viewing}
          open
          onClose={() => setViewing(null)}
        />
      )}

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete schedule</DialogTitle>
            <DialogDescription>
              {deleting
                ? `This will remove the schedule on ${formatDateTime(deleting.startDateTime)} along with its ${deleting.totalSlots} slot(s). This cannot be undone.`
                : "This cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={deletingId !== null} />
              }
            >
              Cancel
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletingId !== null}
            >
              {deletingId !== null && <Spinner />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
