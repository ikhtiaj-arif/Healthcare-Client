const prefix = "/dashboard";

/**
 * Sidebar nav data for the patient area, keyed by the route group layout.
 *
 * `profile` still has no page. It is listed because the backend already exposes
 * the profile routes and the work to build it is not done yet; until then the
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
