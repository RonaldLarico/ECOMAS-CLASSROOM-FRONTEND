import { ContentLayout } from "@/components/side-panel/content-layout";
import ProtectedRoute from "@/components/loginPage/auth-protection";
import TableStaffUser from "@/components/SUPER-ADMIN/users/table-staff-users";
import { Suspense } from "react";
import CreateStaffUser from "@/components/SUPER-ADMIN/users/create-staff-user";
import { Corporation } from "@/lib/definitions";

export default async function UsersPage() {
  const requiredRoles = ["SUPER_ADMIN", "ADMIN"];
  
  // Fetch de empresas (corporations) con manejo de errores
  let corporations: Corporation[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/corporations/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Maneja el error si la respuesta no es exitosa (status >= 400)
      console.error("Error fetching corporations:", response.status);
      throw new Error("Error fetching corporations");
    }

    corporations = await response.json();
  } catch (error) {
    // Manejamos el error, por ejemplo mostrando un mensaje al usuario
    console.error("Fetch failed:", error);
    // Puedes mostrar un estado de error aquí si es necesario
  }

  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <ContentLayout title="Inicio">
        <div className="flex justify-between">
          <div className="text-xl font-semibold">USUARIOS</div>
          <CreateStaffUser corporations={corporations} />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <TableStaffUser />
        </Suspense>
      </ContentLayout>
    </ProtectedRoute>
  );
}
