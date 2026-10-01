import type { AppointmentStatus } from "./appointment.type";

export type ScheduleStatus = "DRAFT" | "PUBLISHED";

export interface ScheduleAppointment {
  id: string;
  status: AppointmentStatus;
  joiningTime: string | null;
  serialNumber: number | null;
  patient: {
    id: string;
    name: string;
    email: string;
    contactNumber: string | null;
  };
}

export interface Schedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  totalSlots: number;
  availableSlots: number;
  meetingLink: string;
  status: ScheduleStatus;
  doctorId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /**
   * Only the list, admin and detail endpoints include appointments. Create,
   * update, publish, delete and today's-schedule responses omit them entirely,
   * so this stays optional.
   */
  appointments?: ScheduleAppointment[];
}

export interface CreateSchedulePayload {
  startDateTime: string;
  endDateTime: string;
  meetingLink: string;
}

/**
 * Mirrors SCHEDULE_SORTABLE_FIELDS in Healthcare-Backend/src/app/utils/sort.ts.
 *
 * A value outside it is a 400 from `parseSort`, so this union is the only
 * enforcement — the backend does no validation of its own here.
 */
export type ScheduleSortField =
  | "createdAt"
  | "updatedAt"
  | "startDateTime"
  | "endDateTime"
  | "totalSlots"
  | "availableSlots"
  | "status";

export interface ScheduleParams {
  status?: ScheduleStatus;
  page?: number;
  limit?: number;
  sortBy?: ScheduleSortField;
  sortOrder?: "desc" | "asc";
}
