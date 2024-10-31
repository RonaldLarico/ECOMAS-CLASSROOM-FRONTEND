import ProtectedRoute from "@/components/loginPage/auth-protection";
import GraduateList from "@/components/schedule/viewSchedule/ListGraduate";
import { ContentLayout } from "@/components/side-panel/content-layout";
import React, { Suspense, useState } from "react";
import Pagination from "@/components/schedule/components/utils/pagination";
import SearchGraduate from "@/components/schedule/viewSchedule/searchGraduate";
import { cookies } from "next/headers";
import {
  CorporationAllList,
  GraduateAllList,
  ModuleAllListSearch,
  showCorporation,
} from "@/actions/ADMIN/getRoutes";
import { Skeleton } from "@/components/ui/skeleton";
import CreateGraduateForm from "@/components/schedule/createSchedule/createGraduate";
import { CorporationList, ModuleList } from "@/actions/ADMIN/interface/interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import graduatesPage from "../../graduates/page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CorporationButtons from "@/components/schedule/components/corporationsButtons";

const requiredRole = ["SUPER_ADMIN", "ADMIN"];

const ListGraduatePage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    graduateId?: string;
    graduateName?: string;
    corporationId?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const graduateId = searchParams?.graduateId || null;
  const graduateName = searchParams?.graduateName || "";
  const corporationId = searchParams?.corporationId || null;
  const limit = 4;
  const token = cookies().get("token")?.value;
  
  if (!token) {
    console.error("Token not found in cookies.");
    return null;
  }
  
  const { totalGraduates, result: graduates } = await GraduateAllList({
    offset: (currentPage - 1) * limit,
    limit,
    token: token,
    search: query,
  });
  
  const totalPages = Math.ceil(totalGraduates / limit);
  
  let selectedGraduateData: CorporationList[] = [];
  if (graduateId) {
    selectedGraduateData = await showCorporation({
      graduateId: parseInt(graduateId),
      token: token,
    });
  }

  let modules: ModuleList[] = [];
  if (graduateId && corporationId) {
    try {
      modules = await ModuleAllListSearch({
        graduateId: parseInt(graduateId),
        corporationId: parseInt(corporationId),
        token: token,
      });
    } catch (error) {
      console.error("Error fetching modules:", error);
    }
  }

  return (
    <ProtectedRoute requiredRoles={requiredRole}>
      <ContentLayout title="Graduados">
        <Accordion
          type="single"
          collapsible
          defaultValue="graduateListAndPagination"
        >
          <AccordionItem value="graduateListAndPagination">
            <AccordionTrigger className="text-md font-bold flex items-center">
              <span>Lista de Diplomados</span>
              {/* <ChevronDown
                className="ml-2 transition-transform duration-200"
                aria-hidden="true"
                data-state-open="rotate-180"
              /> */}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3">
                <div className="flex space-x-2">
                  <SearchGraduate
                    placeholder="Buscar diplomado..."
                    totalGraduates={totalGraduates}
                  />
                </div>
              </div>
              <div className="mt-3">
                <Suspense key={query + currentPage} fallback={<Skeleton />}>
                  <GraduateList
                    graduates={graduates}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalGraduates={totalGraduates}
                  />
                </Suspense>
              </div>
              <div className="relative flex justify-end mt-3">
                <Pagination totalPages={totalPages} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {graduateId && (
          <>
            <h3 className="text-lg font-semibold">Diplomado: {graduateName}</h3>
            <CorporationButtons
              corporations={selectedGraduateData}
              graduateId={graduateId}
              graduateName={graduateName}
              modules={modules}
            />
          </>
        )}
      </ContentLayout>
    </ProtectedRoute>
  );
};

export default ListGraduatePage;
