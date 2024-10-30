import ProtectedRoute from "@/components/loginPage/auth-protection";
import GraduateList from "@/components/schedule/viewSchedule/ListGraduate";
import { ContentLayout } from "@/components/side-panel/content-layout";
import React, { Suspense, useState } from "react";
import Pagination from "@/components/schedule/components/utils/pagination";
import SearchGraduate from "@/components/schedule/viewSchedule/searchGraduate";
import Cookies from "js-cookie";
import { GraduateAllList } from "@/actions/ADMIN/getRoutes";
import { Skeleton } from "@/components/ui/skeleton";
import CreateGraduateForm from "@/components/schedule/createSchedule/createGraduate";
import { Button } from "@/components/ui/button";
import CreateModules from "../../../../components/schedule/createSchedule/createModules";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const requiredRole = ["SUPER_ADMIN", "ADMIN"];

const CreateGraduatePage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 4;
  const token = Cookies.get("token");

  const { totalGraduates } = await GraduateAllList({
    offset: 0,
    limit: 1,
    token: token as string,
    search: query,
  });

  if (isNaN(totalGraduates) || totalGraduates <= 0) {
    console.error("Invalid totalGraduates:", totalGraduates);
    return;
  }

  const totalPages = Math.ceil(totalGraduates / limit);

  const validPage = Math.min(currentPage, totalPages);
  const offset = (validPage - 1) * limit;

  if (isNaN(offset) || offset < 0 || limit <= 0) {
    console.error("Invalid offset or limit:", offset, limit);
    return;
  }

  const { result: graduates } = await GraduateAllList({
    offset: offset,
    limit: limit,
    token: token as string,
    search: query,
  });

  return (
    <ProtectedRoute requiredRoles={requiredRole}>
      <ContentLayout title="Graduados">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">
            Lista de Diplomados
          </h2>

          <div className="flex space-x-2">
            <SearchGraduate placeholder="Buscar..." />
            <CreateGraduateForm />
          </div>
        </div>
        <div className="mt-3">
          <Suspense key={query + currentPage} fallback={<Skeleton />}>
            <GraduateList
              graduates={graduates}
              currentPage={validPage}
              totalPages={totalPages}
              totalGraduates={totalGraduates}
            />
          </Suspense>
          <div className="relative flex justify-end">
            <Pagination totalPages={totalPages} />
          </div>
        </div>
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button>Generar Cronograma</Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 border-2 rounded-2xl">
            <div className="rounded-2xl mb-2 p-4">
              <CreateModules />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </ContentLayout>
    </ProtectedRoute>
  );
};

export default CreateGraduatePage;
