const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Overview",
        url: prefix,
      },
      {
        title: "Doctor Approval",
        url: `${prefix}/approve-doctor`,
      },
      {
        title: "Appointments",
        url: `${prefix}/appointments`,
      },
      {
        title: "Payments",
        url: `${prefix}/payments`,
      },
      {
        title: "Schedules",
        url: `${prefix}/schedules`,
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
