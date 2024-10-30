
import { ContentLayout } from "@/components/side-panel/content-layout";
import ProtectedRoute from "@/components/loginPage/auth-protection";
import { Suspense } from "react";

function DiplomaDraft() {
  const requiredRoles = ["SUPER_ADMIN", "ADMIN"];

  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <ContentLayout title="Inicio">
        <div className="">
         BORRADOR DE DIPLOMADO
        </div>
      </ContentLayout>
    </ProtectedRoute>
  );
}

export default DiplomaDraft;