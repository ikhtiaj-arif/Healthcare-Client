# Frontend v1 — Remaining Work

Everything the `healthcare-frontend` app is still missing, in execution order.

**Status legend:** `- [ ]` pending · `- [x]` complete

**Source of truth:** backend is `Healthcare-Backend` (Express 5 + Prisma 7, 43 module routes).
Frontend is `healthcare-frontend` (Next 16 static export, `output: "export"`).

**Progress:** 73 / 112 complete

> This file lives inside `healthcare-frontend/` deliberately, so it is committed
> and pushed alongside the work it tracks. It used to sit at the workspace root,
> which is not a git repo — from there it had no version history at all.

---

## Coverage baseline

26 of 43 backend routes are consumed. **17 are not**, spread over 8 modules:

| Module | Consumed | Missing |
| --- | --- | --- |
| auth | 7 / 9 | `forgot-password`, `reset-password` |
| user | 0 / 1 | `profile-image` |
| appointment | 6 / 9 | `update-status/:appointmentId`, `doctor-appointments`, `all-appointments` |
| doctor | 6 / 8 | `update-my-profile`, `public/available-today` |
| schedule | 5 / 8 | `all-schedules`, `update-schedule/:scheduleId`, `:scheduleId` |
| payment | 2 / 3 | `all-payments` |
| prescription | 0 / 2 | `create-prescription`, `:appointmentId` |
| analytics | 0 / 3 | `patient-analytics`, `doctor-analytics`, `admin-analytics` |

`GET /appointment/book-appointment/payment/callback` needs no wrapper — `PaymentResultBanner`
already reads `?status=success|failure|cancel`.

---

## Facts that constrain the implementation

Read before writing any of Section A. All verified against the backend.

- **There is no `Prescription` model.** `POST /create-prescription` builds a PDF with pdfkit,
  uploads it to Cloudinary, emails it, and stores only `prescriptionUrl` on the appointment.
  `findings` and `medicines` are never persisted. `GET /prescription/:appointmentId` returns
  `{ appointment, prescription: "<pdf url>" }` — so the UI is a **PDF viewer**, never an editable
  medicine list. Do not write a `Prescription` interface with `medicines`.
- **`404 No Prescription Has Been Written Yet` is the normal empty state**, not an error.
- **Money arrives as a string.** Prisma `Decimal` serializes via `toJSON()` to `"500.00"`, so
  `Payment.amount`, `Payment.refundAmount` and `Doctor.consultationFee` are strings. `Number()`
  before any arithmetic.
- **Every list endpoint uses sibling `meta`.** No endpoint nests `{data:{data,meta}}`. The comment
  at `src/types/api-response.type.ts:26-27` claiming `/doctor/all-doctors` is an exception is
  **false** — fix it in A9 so the next person doesn't reintroduce the bug.
- **`status` query filters are unvalidated strings** on the backend. A typo is a 400. The only
  enforcement is the TS param type, so constrain it to the enum union.
- **`paidAt` and `refundedAt` are `String` columns**, not `DateTime` — they hold bKash's formatted
  timestamps. Never `new Date()` them.
- **`image_public_id` is snake_case** on `User`. Everything else is camelCase except
  `recordPublicId` / `prescriptionPublicId`.
- **The production error envelope has no `data` key** and `message` is always
  `"Internal Server Error"` outside development. Branch on `statusCode`, never `message`.
- **The three analytics endpoints disagree on key names:** `totalRefunded` (patient, admin) vs
  `totalDoctorRefunded` (doctor); `totalRevenue` exists only on admin. 6 / 9 / 10 flat numeric keys,
  no `meta`, no pagination.
- **`consultationFee` must be a real JSON number** on `PATCH /doctor/update-my-profile` — `"500"`
  as a string fails `z.number()`.
- **Filter param names differ per endpoint and must not be unified:**
  `?email=` on `/schedule/all-schedules` (exact match) · `?doctorEmail=` + `?patientEmail=` on
  `/appointment/all-appointments` (exact) · `?patientEmail=` on `/payment/all-payments`
  (**substring**, `contains` + `insensitive`).
- **`/doctor/public/available-today` nests schedules without `meetingLink` or `status`.** If the
  booking UI needs the link, also call `GET /schedule/todays-schedule?doctorId=`.

### Backend enums (copy these exactly)

```ts
Role                     = SUPER_ADMIN | ADMIN | DOCTOR | PATIENT
AppointmentStatus        = PENDING | CONFIRMED | CANCELLED | ONGOING | COMPLETED
PaymentStatus            = UNPAID | PAID | FAILED | CANCELLED | REFUNDED
DoctorVerificationStatus = PENDING | APPROVED | REJECTED
ScheduleStatus           = DRAFT | PUBLISHED
```

### Sortable field allow-lists (a bad `sortBy` is a 400)

| Constant | Values | Used by |
| --- | --- | --- |
| `APPOINTMENT_SORTABLE_FIELDS` | `createdAt`, `updatedAt`, `status`, `joiningTime`, `serialNumber` | my / doctor / all appointments |
| `DOCTOR_SORTABLE_FIELDS` | `createdAt`, `updatedAt`, `name`, `specialization`, `experienceYears`, `consultationFee`, `verificationStatus` | all-doctors, public list, available-today |
| `SCHEDULE_SORTABLE_FIELDS` | `createdAt`, `updatedAt`, `startDateTime`, `endDateTime`, `totalSlots`, `availableSlots`, `status` | schedules, available-today |
| `PAYMENT_SORTABLE_FIELDS` | `createdAt`, `updatedAt`, `status`, `amount`, `currency`, `paidAt`, `refundAmount` | my / all payments |

---

## Section A — API + hook layer

The 17 wrappers, their types, validation and barrels. Everything else depends on this.

### A1 — Password recovery
- [x] `src/api/auth.api.ts`: `forgotPassword`, `resetPassword`
- [x] `src/hooks/auth.hook.ts`: `useForgotPassword`, `useResetPassword`
- [x] `src/validation/auth.validation.ts`: `ForgotPasswordSchema`, `ResetPasswordSchema`
  (mirrors the server: 6-char otp, min 8 password with lower + upper + digit + symbol)
Routes: `POST /auth/forgot-password`, `POST /auth/reset-password`

### A2 — Profile image
- [x] `src/api/user.api.ts` (new): `uploadProfileImage` — multipart, field name `profileImage`
- [x] `src/types/user.type.ts`: reuses `User` rather than adding a near-identical
  `ProfileImageUser` — the upload response is the user row **without** the
  `patient` / `doctor` relations, which `User` already models as optional.
  `image_public_id` is snake_case and was already declared.
- [x] `src/hooks/user.hook.ts` (new): `useUploadProfileImage`, invalidates `USER_QUERY_KEY`
- [x] `src/hooks/auth.hook.ts`: export `USER_QUERY_KEY` so `Header.tsx` and
  `user.hook.ts` stop hand-writing `["user"]`
- [x] register in the `src/api` and `src/hooks` barrels
Routes: `PATCH /user/profile-image`

### A3 — Appointment gap endpoints
- [x] `src/api/appointment.api.ts`: `getDoctorAppointments`, `getAllAppointments`,
  `updateAppointmentStatus`
- [x] `src/types/appointment.type.ts`: `DoctorAppointmentItem` (patient **with** `contactNumber`,
  **no** doctor), `AllAppointmentItem` (doctor + patient **without** `contactNumber`),
  `AllAppointmentsParams`, `UpdateAppointmentStatusPayload`
- [x] `src/types/appointment.type.ts`: promote `AppointmentSortField` out of
  `appointment-list.tsx` and tighten `AppointmentParams.sortBy` from `string` to
  the union — this is the A9 enum constraint, done here because three new lists
  would each otherwise have copied it
- [x] `src/hooks/appointment.hook.ts`: `useGetDoctorAppointments`, `useGetAllAppointments`,
  `useUpdateAppointmentStatus` (separate `"doctor"` / `"all"` key segments)
Routes: `GET /appointment/doctor-appointments`, `GET /appointment/all-appointments`,
`PATCH /appointment/update-status/:appointmentId`

### A4 — Doctor gap endpoints
- [x] `src/api/doctor.api.ts`: `updateMyDoctorProfile`, `getAvailableDoctorsToday`
- [x] `src/types/doctor.types.ts`: `AvailableDoctorToday` (nested schedules lack
  `meetingLink`/`status`), `AvailableDoctorsParams`, `UpdateDoctorProfilePayload`,
  `AvailableDoctorSortField` for available-today's union allow-list
- [x] `src/types/schedule.types.ts`: add `ScheduleSortField` and tighten
  `ScheduleParams.sortBy` — needed by the union above (part of the A9 constraint)
- [x] `src/hooks/doctor.hook.ts`: `useUpdateMyDoctorProfile` (invalidates `USER_QUERY_KEY`
  **and** `DOCTORS_QUERY_KEY`), `useGetAvailableDoctorsToday`
Routes: `PATCH /doctor/update-my-profile`, `GET /doctor/public/available-today`

### A5 — Schedule gap endpoints
- [x] `src/api/schedule.api.ts`: `getAllSchedules`, `getScheduleById`, `updateSchedule`
- [x] `src/types/schedule.types.ts`: **separate type per endpoint** — the three new
  responses carry three different doctor projections (`all-schedules` none, `/:id`
  `{id,name,email,specialization,userId}`, update `{name,email,contactNumber}`).
  Plus `AllScheduleItem`, `ScheduleDetail`, `AllSchedulesParams`, `UpdateSchedulePayload`,
  `ScheduleWithAppointments`, `ScheduleDetailAppointment`, `ScheduleDetailPatient`
- [x] `src/types/schedule.types.ts`: retype `createSchedule`'s response from bare `Schedule`
  to `CreatedSchedule` — the backend already returned a doctor summary we were discarding
- [x] `src/hooks/schedule.hook.ts`: `useAllSchedules`, `useScheduleById`, `useUpdateSchedule`
Routes: `GET /schedule/all-schedules`, `PATCH /schedule/update-schedule/:scheduleId`,
`GET /schedule/:scheduleId`
Note: `update-schedule` resets `availableSlots = totalSlots`, refilling a booked slot.

### A6 — All payments
- [x] `src/api/payment.api.ts`: `getAllPayments`
- [x] `src/types/payment.type.ts`: `AllPaymentItem` (alias of `PaymentListItem` — the backend
  selects identical relations, so a copy would only drift), `AllPaymentsParams`
- [x] `src/hooks/payment.hook.ts`: `useGetAllPayments` (own `"all"` key segment)
Routes: `GET /payment/all-payments`
Confirmed: only filter is `patientEmail` (contains + insensitive). No `status` filter exists.
`gatewayResponse` arrives on the wire but is deliberately undeclared in `Payment`.

### A7 — Prescriptions
- [x] `src/api/prescription.api.ts` (new): `createPrescription`, `getPrescriptionByAppointmentId`
- [x] `src/types/prescription.type.ts` (new): `CreatePrescriptionPayload`, `MedicineInput`,
  `PrescriptionResult` (`{ appointment, prescription }` — the URL only, **no** medicines array),
  `CreatedPrescription`
- [x] `src/validation/prescription.validation.ts` (new): `prescriptionSchema` (findings ≥ 5,
  medicines min 1, each `{name, dosage, duration, instructions?}`), `medicineSchema`,
  `PrescriptionFormValues`, `EMPTY_MEDICINE`
- [x] `src/hooks/prescription.hook.ts` (new): `PRESCRIPTIONS_QUERY_KEY`,
  `useCreatePrescription` (invalidates `APPOINTMENTS_QUERY_KEY` — the update sets
  `prescriptionUrl` on the appointment), `useGetPrescription` (`retry: 0`, see below)
- [x] register in all four `index.ts` barrels
Routes: `POST /prescription/create-prescription`, `GET /prescription/:appointmentId`
Two rules are **not** zod and cannot be mirrored client-side: 400 unless the
appointment is COMPLETED, and 409 if one already exists (no edit or re-issue path).
`GET` 404s with "No Prescription Has Been Written Yet" for the common empty case —
hence `retry: 0`, since the default 3 would stall the empty state.

### A8 — Analytics
- [x] `src/api/analytics.api.ts` (new): `getPatientAnalytics`, `getDoctorAnalytics`,
  `getAdminAnalytics`
- [x] `src/types/analytics.type.ts` (new): `PatientAnalytics` (6 keys),
  `DoctorAnalytics` (9 keys, `totalDoctorRefunded`), `AdminAnalytics` (10 keys, `totalRevenue`)
- [x] `src/hooks/analytics.hook.ts` (new): `ANALYTICS_QUERY_KEY` + three hooks
- [x] register in barrels
Routes: `GET /analytics/patient-analytics`, `/doctor-analytics`, `/admin-analytics`
Three gotchas confirmed in `analytics.service.ts`: `upcomingAppointments` counts
CONFIRMED only; `totalDoctorEarnings` is net of refunds (not gross); and the refund
key is `totalRefunded` for patient/admin but `totalDoctorRefunded` for doctor.

### A9 — Cross-cutting corrections
- [x] `src/types/api-response.type.ts`: delete the false "the doctor module nests instead"
  claim at lines 26-27 — all 12 list endpoints use sibling `meta`
- [x] constrain every `status` / `sortBy` param type to the backend enums and allow-lists above
- [x] add `useIsMobile` to the `src/hooks/index.ts` barrel (currently deep-imported only)
- [x] drop the dead doctor hooks rather than wire them: removed
  `useGetAllPublicDoctors` (superseded by `useSuspenseGetPublicDoctors`, which
  `doctor-list.tsx` actually calls), `usePublicDoctorProfile` and
  `useSuspenseGetAllDoctors`. The underlying api functions stay — the static-export
  `[id]/page.tsx` fetches both directly at build time, where react-query is the wrong tool.
Routes: n/a — corrections

---

## Section B — Auth & profile UI

### B1 — Forgot password
- [x] `src/components/form/ForgotPasswordForm.tsx` — email only; the OTP lives in Redis for
  300 s, so surface the 5-minute window in the success copy (`OTP_LIFETIME_MINUTES`)
- [x] `src/app/(public)/(authentication)/forgot-password/page.tsx` — no Suspense
  boundary: unlike `/login` this form never calls `useSearchParams`
- [x] link from `LoginForm.tsx` (`href="#"` → `/forgot-password`)
Routes: `POST /auth/forgot-password`

Backend rejects before sending, each with a distinct status — 404 "User does not
exist!", 403 "User not verified!", 403 "User is Blocked!", 404 "User is Deleted!",
409 "User Has account with google". All surfaced verbatim via `getApiErrorMessage`.
Note this makes the endpoint an **account-enumeration oracle**: "no such user" vs
"unverified" vs "google-only" are distinguishable by status code. Backend behaviour,
not something the form should paper over.
Response is `data: null` — no expiry is returned, hence the hardcoded 5 minutes.
**Flow is incomplete until B2:** success pushes to `/reset-password?email=…`,
which does not exist yet and will 404.

### B2 — Reset password
- [x] `src/components/form/ResetPasswordForm.tsx` — email + 6-char OTP + new password, reusing
  the `InputOTP` pattern from `VerifyAccountForm.tsx`
- [x] `src/app/(public)/(authentication)/reset-password/page.tsx` (`?email=` carried across)
  — **needs** the Suspense boundary, because this form does call `useSearchParams`
- [x] on success route to `/login` — the backend does **not** revoke live cookies
Routes: `POST /auth/reset-password`

No `?email=` → `router.replace("/forgot-password")` rather than the dead-end
`router.push("/")` that `VerifyAccountForm` uses, since this page is only
reachable with an email in hand.
`confirmPassword` is client-only; the backend never receives it (see `ResetPasswordSchema`).
Distinct OTP failures, both 400: "Invalid OTP" (missing/expired Redis key) vs
"OTP does not match". Worth telling apart — the first means *request a new code*,
the second means *retype the same one*.

### B3 — Profile page, all roles
- [x] `src/app/(dashboard)/dashboard/profile/page.tsx`, `.../doctor/profile/page.tsx`,
  `.../admin/profile/page.tsx` — one shared `ProfileView` mounted by each
- [x] read-only fields from `GET /auth/me`; editable fields are limited to what the backend accepts
- [x] `ProfileImageUpload` — preview, `multipart/form-data`, field `profileImage`
- [x] resolve the existing `/dashboard/profile` sidebar link, and add the same link
  under doctor and admin
Routes: `PATCH /user/profile-image`, `GET /auth/me`

### B4 — Doctor profile edit
- [x] `src/components/form/DoctorProfileForm.tsx` — `address` (min 5), `bio` (max 1000),
  `consultationFee` (**JSON number**), `contactNumber` (min 5)
- [x] invalidate `["user"]` after save so `/auth/me` reflects it (`useUpdateMyDoctorProfile`)
Routes: `PATCH /doctor/update-my-profile`
`GET /auth/me` now selects `address`, `bio`, `consultationFee`, and `contactNumber`
so the form can be prefilled. The public doctor profile still omits the private fields.

---

## Section C — Prescriptions

### C1 — Doctor writes a prescription
- [x] `PrescriptionForm` — dynamic `medicines[]` rows (add / remove), findings textarea
- [x] mount on a **COMPLETED** appointment only; the backend 400s otherwise
- [x] `409 A Prescription Already Exists` must surface, not silently retry
Routes: `POST /prescription/create-prescription`

### C2 — Prescription viewer
- [x] `PrescriptionViewer` — renders `data.prescription` (a Cloudinary PDF) in an iframe,
  with an open-in-new-tab fallback
- [x] mount for patient, doctor and admin from the appointment detail sheet
- [x] `404` renders an empty state ("no prescription written yet"), not an error
Routes: `GET /prescription/:appointmentId`

---

## Section D — Analytics dashboards

Patient, doctor, and admin overviews render the analytics cards below.

### D1 — Patient
- [x] `PatientAnalyticsCards` — 6 keys. Note `upcomingAppointments` counts **CONFIRMED only**;
  there is no `pendingAppointments` key.
Routes: `GET /analytics/patient-analytics`

### D2 — Doctor
- [x] `DoctorAnalyticsCards` — 9 keys. `totalDoctorEarnings` is already **net of refunds**, so it
  is not gross revenue. No `draftSchedules` or `pendingAppointments` key exists.
Routes: `GET /analytics/doctor-analytics`

### D3 — Admin
- [x] `AdminAnalyticsCards` — 10 keys
Routes: `GET /analytics/admin-analytics`

---

## Section E — Admin lists

Follow the **current** convention (`modules/doctor-approval/doctor-approval-tabs.tsx`):
`useListState` + `DataTableToolbar` + `SortableTableHead` + `StatusBadge` + `EmptyTableRow`
+ `TablePagination`, with a real error state. Do **not** copy the older
`modules/payments/` or `modules/doctor-schedule/` pattern (raw `<tr><td colSpan>` loading,
`EmptyState` outside the table, hand-rolled count line).

### E1 — All appointments
- [ ] `/admin/appointments` — status tabs, search, sortable, detail sheet
- [ ] `appointment-detail-sheet` must be reusable here (see I3)
- [ ] filters: `status`, `doctorId`, `patientId`, `doctorEmail`, `patientEmail` (all exact match)
Routes: `GET /appointment/all-appointments`

### E2 — All payments
- [ ] `/admin/payments` — sortable only; there is **no** `status` filter on this endpoint
- [ ] omit `gatewayResponse` from the rendered detail — it is the raw bKash payload and can be huge
Routes: `GET /payment/all-payments`

### E3 — All schedules
- [ ] `/admin/schedules` — status tabs, search (`doctor.name` / `doctor.email` /
  `doctor.specialization`), `doctorId`, `email`
- [ ] appointments are **not** filtered by the backend — CANCELLED / PENDING / ONGOING / COMPLETED
  all appear. Filter client-side in the detail sheet.
Routes: `GET /schedule/all-schedules`

---

## Section F — Doctor appointments

### F1 — List
- [x] `/doctor/appointments` — status tabs, sortable. No `searchTerm`, `doctorId`, `patientId` or
  date filter exists on this endpoint.
- [x] items carry the patient **with** `contactNumber`, and no doctor relation
Routes: `GET /appointment/doctor-appointments`

### F2 — Status action
- [x] encode the transition rules client-side: `CONFIRMED → ONGOING` only,
  `ONGOING → COMPLETED` only
- [x] the two 400s that fire on a skipped step:
  `"Confirmed appointment must be ongoing at first"` and
  `"Ongoing appointment must be completed"` — surfaced through `getApiErrorMessage`
- [x] 403 `Appointment is already completed` / `already Cancelled`; 404 for another doctor's row
Routes: `PATCH /appointment/update-status/:appointmentId`

---

## Section G — Schedule

### G1 — Edit a schedule
- [ ] `ScheduleEditDialog` reusing `CreateScheduleForm`'s window logic (`resolveScheduleWindow`,
  `MINUTES_PER_SLOT = 20`)
- [ ] surface all five 409s: already-published-and-booked, start after end, not same day,
  duplicate schedule that day, under 20 minutes
- [ ] note the server **resets** `availableSlots = totalSlots` on update
Routes: `PATCH /schedule/update-schedule/:scheduleId`

### G2 — Single schedule detail
- [ ] `GET /schedule/:scheduleId` returns `doctor` + `appointments[]` with full patients; its
  doctor projection is `{id,name,email,specialization,userId}`, different from create/update
Routes: `GET /schedule/:scheduleId`

---

## Section H — Public pages

### H1 — Available today
- [ ] `/doctors/available-today` — `searchTerm` matches name **or** specialization;
  `specialization` exact-insensitive
- [ ] `sortBy` accepts the **union** of the doctor and schedule allow-lists here
Routes: `GET /doctor/public/available-today`

### H2 — Home
- [ ] real home page; `modules/homepage/Hero.tsx` is currently `<div>Hero Section</div>` and is
  imported by nothing
Routes: n/a — public content

### H3 — About and contact
- [ ] `Header.tsx` links `/about` (real page is `/about-us`) and `/contact` (no page at all) —
  both 404 on every marketing page
Routes: n/a — public content

---

## Section I — Bugs & cleanup

### Security
- [x] **I1** `src/components/form/LoginForm.tsx:58-61` shipped
  `superadmin@gmail.com` / `Super@admin1234` as the form's `defaultValues`. Cleartext
  super-admin credentials were in the production bundle. **Fixed** — both defaults are
  now `""`, with a comment saying why so they are not "helpfully" restored. Swept
  `src/` afterwards: no other hard-coded credentials remain.
- [x] **I2** ~~`error.tsx` destructures `retry`; Next passes `reset`~~ — **RETRACTED,
  this was a false positive in the audit.** Verified against Next 16.3.4's runtime at
  `node_modules/next/dist/client/components/error-boundary.js:113-115`, which passes
  **both** `reset` and `retry` to the error component; the bundled docs document `retry`
  as the recommended prop. `doctor/schedule/error.tsx` is correct as written and its
  "Try again" button does not throw. No change made.

### Broken features
- [x] **I3** `my-appointments/page.tsx` only rendered `<AppointmentList />`, so
  `?appointment=<id>` opened nothing. `AppointmentDetailSheet` is now mounted, and
  it closes against the current path so doctor and admin lists can reuse it.
- [ ] **I4** `schedule-list.tsx:35` guards on `isPending || !data`, so once react-query exhausts
  its retries the skeleton renders **forever**; the route's `error.tsx` is never reached.
- [ ] **I5** `doctor-approval-tabs.tsx:84` and `doctor-approval-stats.tsx:7` have no `isError`
  branch — a 500 renders as "No applications here yet." and a row of zeros. This is the admin's
  doctor-approval screen.

### Missing route conventions
- [ ] **I6** no `error.tsx` for `/doctors`, `/admin/approve-doctor`, `/dashboard/*`; the only
  boundary in the app is scoped to `/doctor/schedule`
- [ ] **I7** three `<Suspense fallback={null}>` boundaries render a blank region —
  `admin/approve-doctor`, `dashboard/my-appointments`, `dashboard/payment-history`. Give them real
  skeletons. Also `apply/verify-account` and `register/verify-account` use a bare
  `<p>Loading...</p>`.

### Placeholder content
- [x] **I8** `src/app/(dashboard)/layout.tsx` used to render the literal string
  `General Dashboard Layout:` above every authenticated page. Removed; the
  segment layouts already wrap children in `DashboardShell`.
- [ ] **I9** `src/app/layout.tsx:20-23` — `title: "Create Next App"`,
  `description: "Generated by create next app"`
- [ ] **I10** `src/components/layouts/public/Footer.tsx:6` — `copyright © 2024 Your Company. All
  rights reserved.`
- [ ] **I11** `src/app/(public)/(marketing)/page.tsx:4` — `<div>Home page 1q2</div>` (see H2)
- [ ] **I12** `src/app/(public)/(marketing)/about-us/page.tsx:4` — `<div>About us page</div>` (see H3)
- [ ] **I13** `public/` still holds the five create-next-app demo assets (`file.svg`, `globe.svg`,
  `next.svg`, `vercel.svg`, `window.svg`), none referenced from `src/`

### Navigation
- [x] **I14** **no logout control on any dashboard route.** `useLogout` used to be imported only by
  the public `Header`. `/dashboard/*`, `/doctor/*` and `/admin/*` now sign out from a
  `SidebarFooter` user menu.
- [x] **I15** `admin.routes.ts` and `doctor.routes.ts` shipped an untouched shadcn demo
  group — "App Settings / Routing / Data Fetching". Removed. Real destinations for the new
  lists are added in the commits that create those pages.
- [x] **I16** `dashboard-sidebar.tsx` used `isActive={pathName === item.url}`, an exact string
  compare, so nothing was highlighted on a nested path. Section roots stay exact; other
  paths match by prefix, and `#` never activates.
- [x] **I17** `doctor.routes.ts` labeled the link **"Create Schedule"** but pointed at
  `/doctor/schedule`, which is a list page. The label is now **Schedules**.
- [x] **I18** `Header.tsx` showed the destructive **Logout** button while `useGetMe()` was
  in flight, and nested an `<a>` inside a `<button>`. Loading shows a disabled Login,
  Login uses the button `render` prop, and Logout is a button that navigates after success.

### Dead code
- [x] **I19** `dashboars-shell.tsx` (sic) had orphaned JSX at module scope and was renamed
  to `dashboard-shell.tsx`. The sidebar trigger is restored so the shell can collapse.
  Pages still supply their own padding.
- [ ] **I20** ~20 unused imports, incl. `import { Stalemate } from "next/font/google"` in
  `src/providers/query.provider.tsx:8`, and `React` in several files. The orphaned
  `Breadcrumb*` imports left with `dashboars-shell.tsx`.
- [ ] **I21** `src/components/ui/badge.tsx` and `src/components/ui/dropdown-menu.tsx` have **zero**
  importers. Keep or delete.
- [ ] **I22** `src/hooks/use-list-state.hook.ts` returns a `resetState` callback no caller invokes
- [ ] **I23** `useGetAllPublicDoctors`, `usePublicDoctorProfile`, `useSuspenseGetAllDoctors` have no
  consumers. Either wire them in B3/E1 or drop them.
- [ ] **I24** `DoctorApplyForm.tsx:48-52` has a commented-out sample payload; `apply/page.tsx:24-30`
  has a commented-out `<img src="/login.jpg">` for a file that does not exist, leaving an empty
  grey block
- [ ] **I25** `src/validation/auth.validation.ts:44` — unresolved `//todo we need to confirm from [3-9]`
- [x] **I26** `admin/layout.tsx` and `doctor/layout.tsx` had
  `/** biome-ignore-all lint/a11y/useValidAriaRole: <explanation> */`. Both now use the
  same real reason as the patient layout.
- [ ] **I27** `LoginForm.tsx:86` — leftover `console.log(err)`

---

## Section J — Doctor detail pages in the static export

`output: "export"` means `generateStaticParams` is the **only** thing that decides which
`/doctors/<id>` HTML files exist. `out/doctors/` currently holds **3** files while `/doctors`
advertises a link for every doctor the live API returns — every other one is a hard 404 on the
static host, with no `not-found.tsx` to catch it.

**Known limitation, accepted:** a newly approved doctor still needs a rebuild before their page
exists. This section hardens the crawl; it does not make the catalog live.

- [ ] **J1** `src/app/(public)/(marketing)/doctors/[id]/page.tsx` —
  pages 2..N have no error wrapping, so a failure on page 3 dies with an opaque fetch error
  instead of the actionable message page 1 produces. Wrap every page.
- [ ] **J2** the crawl is sequential (`await` inside `for`), one round trip per 100 doctors
- [ ] **J3** if the API returns 200 with missing/renamed `meta`, `totalPages` silently becomes 1
  and the loop never runs — a green build shipping a truncated catalog. Log loudly.
- [ ] **J4** add `src/app/(public)/(marketing)/doctors/[id]/not-found.tsx` so the residual
  404s land on something styled

---

## Section K — Verification

- [ ] **K1** `npx tsc --noEmit` passes
- [ ] **K2** `npm run build` succeeds and the static export is written to `out/`
- [ ] **K3** smoke every new and changed route in the browser against the local backend
- [ ] **K4** `biome check` on the files touched only — the repo-wide lint **already fails** with
  130 errors and must not be used as a gate. Never run a repo-wide `biome format --write`.

---

## Notes

- Commits are conventional-ish: `feat: ...`, `fix: ...`. Frontend default branch is `dev`.
- `src/components/ui/*` is shadcn-generated: PascalCase filenames, 2-space indent, **no
  semicolons**. Everything else under `src/` is kebab-case and semicolon-terminated. Match the
  file you are editing.
- No tests exist in either project and there is no CI. Verify manually.
