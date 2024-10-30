
import { ContentLayout } from "@/components/side-panel/content-layout";
import { SearchStudent } from "@/components/ADVICE/advice-dashboard-items/search-student";
import ProtectedRoute from "@/components/loginPage/auth-protection";
import { Suspense } from "react";

function AdminHome() {
  const requiredRoles = ["SUPER_ADMIN", "ADMIN"];

  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <ContentLayout title="Inicio">
        <SearchStudent />
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-6 lg:gap-12">
         aasasdasdasdasd
        </div>
      </ContentLayout>
    </ProtectedRoute>
  );
}

export default AdminHome;