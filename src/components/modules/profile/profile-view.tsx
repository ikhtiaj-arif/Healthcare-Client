"use client";

import { DoctorProfileForm } from "@/components/form/DoctorProfileForm";
import { ProfileImageUpload } from "@/components/modules/profile/profile-image-upload";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { useGetMe } from "@/hooks";

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b py-3 last:border-b-0">
      <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

export function ProfileView() {
  const { data, isPending, isError } = useGetMe();
  const user = data?.data;

  if (isPending) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (isError || !user) {
    return (
      <p className="text-sm text-muted-foreground">
        Your profile could not be loaded. Refresh the page and try again.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Profile"
        description="Your account details. Name and email are set at registration."
      />

      <ProfileImageUpload imageUrl={user.imageUrl} name={user.name} />

      <dl>
        <ReadOnlyRow label="Name" value={user.name} />
        <ReadOnlyRow label="Email" value={user.email} />
        <div className="flex flex-col gap-1 border-b py-3">
          <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Role
          </dt>
          <dd>
            <StatusBadge status={user.role} />
          </dd>
        </div>
        <div className="flex flex-col gap-1 border-b py-3">
          <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Status
          </dt>
          <dd>
            <StatusBadge status={user.status} />
          </dd>
        </div>
        <ReadOnlyRow
          label="Sign-in"
          value={user.authProvider === "GOOGLE" ? "Google" : "Email and password"}
        />
        {user.patient ? (
          <>
            <ReadOnlyRow
              label="Contact number"
              value={user.patient.contactNumber || "Not provided"}
            />
            <ReadOnlyRow
              label="Address"
              value={user.patient.address || "Not provided"}
            />
          </>
        ) : null}
        {user.doctor ? (
          <>
            <ReadOnlyRow label="Specialization" value={user.doctor.specialization} />
            <div className="flex flex-col gap-1 border-b py-3">
              <dt className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Verification
              </dt>
              <dd>
                <StatusBadge status={user.doctor.verificationStatus} />
              </dd>
            </div>
          </>
        ) : null}
      </dl>

      {user.role === "DOCTOR" && user.doctor ? (
        <section className="flex max-w-xl flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold">Doctor details</h2>
            <p className="text-sm text-muted-foreground">
              Specialization, name, and license are fixed after approval. You
              can update how patients reach you and what you charge.
            </p>
          </div>
          <DoctorProfileForm key={user.updatedAt} doctor={user.doctor} />
        </section>
      ) : null}
    </div>
  );
}
