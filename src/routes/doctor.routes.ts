const prefix = "/doctor";

export const doctorRoutes = [
  {
    title: "Schedule",
    items: [
      {
        title: "Overview",
        url: prefix,
      },
      {
        title: "Schedules",
        url: `${prefix}/schedule`,
      },
      {
        title: "Appointments",
        url: `${prefix}/appointments`,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        url: `${prefix}/profile`,
      },
    ],
  },
];
