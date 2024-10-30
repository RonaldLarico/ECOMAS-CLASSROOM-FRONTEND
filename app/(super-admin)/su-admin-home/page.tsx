
import { ContentLayout } from "@/components/side-panel/content-layout";
import ProtectedRoute from "@/components/loginPage/auth-protection";
import { Suspense } from "react";

function InicioPageAdvice() {
  const requiredRoles = ["SUPER_ADMIN", "ADMIN"];

  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <ContentLayout title="Inicio">
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-6 lg:gap-12">
         SUPER DAMIN HOME
        </div>
      </ContentLayout>
    </ProtectedRoute>
  );
}

export default InicioPageAdvice;