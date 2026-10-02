"use client";

import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce, useGetAvailableDoctorsToday } from "@/hooks";
import type { AvailableDoctorSortField } from "@/types";

const sortOptions: { value: AvailableDoctorSortField; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "specialization", label: "Specialization" },
  { value: "consultationFee", label: "Fee" },
  { value: "startDateTime", label: "Next slot" },
  { value: "availableSlots", label: "Open slots" },
];

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString(undefined, { timeStyle: "short" });
}

export function AvailableTodayList() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [sortBy, setSortBy] = useState<AvailableDoctorSortField>("startDateTime");
  const searchTerm = useDebounce(search, 400);
  const { data, isPending, isError } = useGetAvailableDoctorsToday({
    limit: 20,
    sortBy,
    ...(searchTerm ? { searchTerm } : {}),
    ...(specialization ? { specialization } : {}),
  });
  const doctors = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          value={search}
          placeholder="Name or specialization"
          onChange={(event) => setSearch(event.target.value)}
        />
        <Input
          value={specialization}
          placeholder="Specialization, exact"
          onChange={(event) => setSpecialization(event.target.value)}
        />
        <select
          className="h-10 border bg-transparent px-3 text-sm"
          value={sortBy}
          onChange={(event) =>
            setSortBy(event.target.value as AvailableDoctorSortField)
          }
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {isError ? (
        <EmptyState
          icon={Stethoscope}
          title="Could not load today's doctors"
          description="Please try again in a moment."
        />
      ) : isPending ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : doctors.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="No one is free today"
          description="Search matches a name or specialization. The specialization box is an exact match."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {doctors.map((doctor) => (
            <Card key={doctor.id}>
              <CardHeader>
                <CardTitle>{doctor.name}</CardTitle>
                <CardDescription className="flex items-center gap-1.5">
                  <Stethoscope className="size-3.5" />
                  {doctor.specialization}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {doctor.consultationFee != null ? (
                  <p>Fee {doctor.consultationFee}</p>
                ) : null}
                <ul className="space-y-1">
                  {doctor.schedules.map((schedule) => (
                    <li key={schedule.id}>
                      {formatTime(schedule.startDateTime)} –{" "}
                      {formatTime(schedule.endDateTime)} · {schedule.availableSlots}{" "}
                      open
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`/doctors/${doctor.id}`} />}
                >
                  Book
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
