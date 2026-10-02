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
