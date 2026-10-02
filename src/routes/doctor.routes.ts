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
];
