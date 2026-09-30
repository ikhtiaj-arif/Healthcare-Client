const prefix = "/dashboard";

/**
 * Sidebar nav data for the patient area, keyed by the route group layout.
 *
 * `payment-history` has no page yet. It is listed because the backend already
 * exposes GET /payment/my-payments and Phase 3 is to build it; until then the
 * link 404s. Delete the entry rather than ship a dead link if that work is
 * dropped.
 */
export const patientRoutes = [
  {
    title: "Bookings",
    url: "#",
    items: [
      {
        title: "Overview",
        url: prefix,
      },
      {
        title: "My Appointments",
        url: `${prefix}/my-appointments`,
      },
      {
        title: "Payment History",
        url: `${prefix}/payment-history`,
      },
    ],
  },
  {
    title: "Account",
    url: "#",
    items: [
      {
        title: "Profile",
        url: `${prefix}/profile`,
      },
    ],
  },
];
