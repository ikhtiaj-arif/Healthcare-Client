const prefix = "/patient"

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
        title: "Payment History",
        url: `${prefix}/payment-history`,
      },
    ],
  },
  {
    title: "App Settings",
    url: "#",
    items: [
      {
        title: "Routing",
        url: "#",
      },
      {
        title: "Data Fetching",
        url: "#",
        isActive: true,
      },
    ],
  },
];
