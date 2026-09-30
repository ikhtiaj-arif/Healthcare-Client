"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Schedule } from "@/types";

interface Props {
  schedule: Schedule;
  open: boolean;
  onClose: () => void;
}

export default function ScheduleDetailSheet({
  schedule,
  open,
  onClose,
}: Props) {
  const appointments = schedule.appointments ?? [];

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Schedule details</SheetTitle>
          <SheetDescription>
            {new Date(schedule.startDateTime).toLocaleDateString(undefined, {
              dateStyle: "full",
            })}
          </SheetDescription>
        </SheetHeader>
        <dl className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Start</dt>
            <dd>
              {new Date(schedule.startDateTime).toLocaleTimeString(undefined, {
                timeStyle: "short",
              })}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">End</dt>
            <dd>
              {new Date(schedule.endDateTime).toLocaleTimeString(undefined, {
                timeStyle: "short",
              })}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Status</dt>
            <dd>{schedule.status}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Slots</dt>
            <dd>
              {schedule.totalSlots - schedule.availableSlots}/
              {schedule.totalSlots} booked
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Meeting link</dt>
            <dd className="truncate">
              <a
                href={schedule.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-primary"
              >
                Join
              </a>
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <h3 className="text-sm font-medium">Booked patients</h3>
          {appointments.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No one has booked a slot on this schedule yet.
            </p>
          ) : (
            <ul className="mt-2 flex flex-col gap-3">
              {appointments.map((appointment) => (
                <li
                  key={appointment.id}
                  className="flex items-start justify-between gap-4 text-sm"
                >
                  <div className="min-w-0">
                    <div className="truncate font-medium">
                      {appointment.patient.name}
                    </div>
                    <div className="truncate text-muted-foreground">
                      {appointment.patient.email}
                    </div>
                    {appointment.patient.contactNumber && (
                      <div className="text-muted-foreground">
                        {appointment.patient.contactNumber}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-muted-foreground">
                      {appointment.serialNumber !== null &&
                        `#${appointment.serialNumber} · `}
                      {appointment.status}
                    </div>
                    {appointment.joiningTime && (
                      <div className="text-muted-foreground">
                        {new Date(appointment.joiningTime).toLocaleTimeString(
                          undefined,
                          { timeStyle: "short" },
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
