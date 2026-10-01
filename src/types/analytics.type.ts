export interface PatientAnalytics {
  totalAppointments: number;
  upcomingAppointments: number; // CONFIRMED only
  completedAppointments: number;
  cancelledAppointments: number;
  totalAmountSpent: number;
  totalRefunded: number;
}

export interface DoctorAnalytics {
  totalSchedules: number;
  publishedSchedules: number;
  totalAppointments: number;
  upcomingAppointments: number;
  ongoingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalDoctorEarnings: number; // net of refunds
  totalDoctorRefunded: number; // different key name from patient/admin
}

export interface AdminAnalytics {
  totalDoctors: number;
  totalPendingDoctorApplications: number;
  totalApprovedDoctors: number;
  totalRejectedDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  totalCompletedAppointments: number;
  totalCancelledAppointments: number;
  totalRevenue: number; // = paid - refunded (as returned)
  totalRefunded: number;
}
