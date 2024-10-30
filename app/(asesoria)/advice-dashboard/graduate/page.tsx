import { ContentLayout } from "@/components/side-panel/content-layout";
import { Suspense } from "react";
import { SkeletonDetailsGraduateAdvice } from "@/components/skeletons/advice/skeletonGraduateDetails";
import GraduateTableDetails from "@/components/ADVICE/advice-graduate-items/A_graduateDataDetails";
import ProtectedRoute from "@/components/loginPage/auth-protection";

export default async function AdviceGraduateDetails({
  searchParams,
}: {
  searchParams?: {
    id?: string;
    studentId?: string;
  };
}) {
  const id = searchParams?.id || "";
  const requiredRoles = ["ADVICE", "SUPER_ADMIN"];

  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
    <ContentLayout title="graduates">
      <Suspense key={id} fallback={<SkeletonDetailsGraduateAdvice />}>
        <GraduateTableDetails id={id} />
      </Suspense>
    </ContentLayout>
    </ProtectedRoute>
  );
}
