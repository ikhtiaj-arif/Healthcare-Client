"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useUploadProfileImage } from "@/hooks";
import { getApiErrorMessage } from "@/utils";

export function ProfileImageUpload({
  imageUrl,
  name,
}: {
  imageUrl?: string | null;
  name: string;
}) {
  const { mutateAsync, isPending } = useUploadProfileImage();
  const [preview, setPreview] = useState<string | null>(null);
  const shown = preview ?? imageUrl;

  const onFile = async (file: File | undefined) => {
    if (!file) {
      return;
    }
    setPreview(URL.createObjectURL(file));
    try {
      await toast.promise(mutateAsync(file), {
        loading: {
          title: "Uploading photo",
          description: "Replacing your profile picture.",
        },
        success: {
          title: "Photo updated",
          description: "Your new profile picture is saved.",
        },
        error: (err) => ({
          title: "Upload failed",
          description: getApiErrorMessage(
            err,
            "Please try a different image.",
          ),
        }),
      });
    } catch {
      setPreview(null);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {shown ? (
        <img
          src={shown}
          alt={`${name}'s profile photo`}
          className="size-16 object-cover ring-1 ring-foreground/10"
        />
      ) : (
        <div className="flex size-16 items-center justify-center bg-muted text-sm font-medium">
          {name.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">{name}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          nativeButton={false}
          render={
            <label>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={isPending}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  void onFile(file);
                }}
              />
            </label>
          }
        >
          {isPending ? (
            <>
              <Spinner />
              Uploading
            </>
          ) : (
            "Change photo"
          )}
        </Button>
      </div>
    </div>
  );
}
