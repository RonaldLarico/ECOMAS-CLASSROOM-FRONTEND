'use client';

import { useAuth } from "@/context/Authcontext";
import { UserProvider } from "@/context/dataUserContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { id } = useAuth();

  return (
    <UserProvider userId={id || ''}>
      {children}
    </UserProvider>
  );
}