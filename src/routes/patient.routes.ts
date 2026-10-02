const prefix = "/dashboard";

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
