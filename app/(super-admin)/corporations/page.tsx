import { ContentLayout } from "@/components/side-panel/content-layout";
import ProtectedRoute from "@/components/loginPage/auth-protection";
import TableCorporations from "@/components/SUPER-ADMIN/Corporation/table-corporations";
import CreateCorporation from "@/components/SUPER-ADMIN/Corporation/create-corporation";
import TableInstitutes from "@/components/SUPER-ADMIN/Institute/table-institutes";
import { Suspense } from "react";
import CreateInstitute from "@/components/SUPER-ADMIN/Institute/create-institute";
export default async function CorporationsPage() {
  const requiredRoles = ["SUPER_ADMIN", "ADMIN"];
  let data = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/corporations/`
  );
  let corporations = await data.json();
  corporations.map((corp: any) => ({
    value: corp.id.toString(),
    label: corp.name,
  }))

  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <ContentLayout title="Inicio">
        <div className="flex justify-between">
          <div className="text-xl font-semibold">CORPORACIONES</div>
          <CreateCorporation />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <TableCorporations />
        </Suspense>
        <div className="flex justify-between mt-4">
          <div className="text-xl font-semibold">INSTITUCIONES</div>
          <CreateInstitute corporations={corporations} />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <TableInstitutes />
        </Suspense>
      </ContentLayout>
    </ProtectedRoute>
  );
}
