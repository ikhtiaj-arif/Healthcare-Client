import apiClient from "@/lib/apiClient";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

const GoogleAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return <>{children}</>;
  }
  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;

export function googleOAuth(payload: { idToken: string }) {
  return apiClient("/auth/google-login", {method:"POST", body: payload });
}
