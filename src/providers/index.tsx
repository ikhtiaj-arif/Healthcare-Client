"use client";
import GoogleAuthProvider from "./google-auth.provider";
import QueryProvider from "./query.provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleAuthProvider>
      <QueryProvider>{children}</QueryProvider>
    </GoogleAuthProvider>
  );
}
