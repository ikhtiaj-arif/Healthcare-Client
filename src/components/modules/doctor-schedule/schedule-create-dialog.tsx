"use client";

import { useState } from "react";
import { CreateScheduleForm } from "@/components/form/CreateScheduleForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ScheduleCreateDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="lg" />}>Create Schedule</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Schedule</DialogTitle>
          <DialogDescription>
            This schedule will be visible to patients once published.
          </DialogDescription>
        </DialogHeader>
        <CreateScheduleForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
