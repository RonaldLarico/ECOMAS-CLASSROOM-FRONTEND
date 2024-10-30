'use client';

import { ContentLayout } from "@/components/side-panel/content-layout";
import ProtectedRoute from "@/components/loginPage/auth-protection";
import { Suspense } from "react";

function InicioPageAdvice() {
  const requiredRoles = ["SUPER_ADMIN", "ADMIN"];

  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <ContentLayout title="Inicio">
        <div className="">
          HOME ADMIN
        </div>
      </ContentLayout>
    </ProtectedRoute>
  );
}

export default InicioPageAdvice;