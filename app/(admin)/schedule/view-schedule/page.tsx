import ProtectedRoute from "@/components/loginPage/auth-protection";
import GraduateList from "@/components/schedule/viewSchedule/ListGraduate";
import { ContentLayout } from "@/components/side-panel/content-layout";
import React, { Suspense, useState } from "react";
import Pagination from "@/components/schedule/components/utils/pagination";
import SearchGraduate from "@/components/schedule/viewSchedule/searchGraduate";
import { cookies } from "next/headers";
import {
<<<<<<< HEAD
  CorporationAllList,
=======
>>>>>>> 92cd1691678b2b3939ca3eed983ea72f6c7b8b2a
  GraduateAllList,
  ModuleAllListSearch,
} from "@/actions/ADMIN/getRoutes";
import { Skeleton } from "@/components/ui/skeleton";
import CreateGraduateForm from "@/components/schedule/createSchedule/createGraduate";
<<<<<<< HEAD
import { CorporationList, ModuleList } from "@/actions/ADMIN/interface/interface";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Corporation } from '../../../../actions/ADMIN/interface/interface';
=======
import { ModuleList } from "@/actions/ADMIN/interface/interface";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
>>>>>>> 92cd1691678b2b3939ca3eed983ea72f6c7b8b2a

const requiredRole = ["SUPER_ADMIN", "ADMIN"];

const ListGraduatePage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    graduateId?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const graduateId = searchParams?.graduateId || null;
  const limit = 4;
  const token = cookies().get("token")?.value;

  if (!token) {
    console.error("Token not found in cookies.");
    return null;
  }

  const { totalGraduates } = await GraduateAllList({
    offset: 0,
    limit: 1,
    token: token,
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
    token: token,
    search: query,
  });

<<<<<<< HEAD
  let selectedGraduateData: CorporationList[] = [];
=======
  let selectedGraduateData: ModuleList[] = [];
>>>>>>> 92cd1691678b2b3939ca3eed983ea72f6c7b8b2a
  if (graduateId) {
    selectedGraduateData = await CorporationAllList({
      graduateId: parseInt(graduateId),
<<<<<<< HEAD
=======
      name: "ECOMAS",
>>>>>>> 92cd1691678b2b3939ca3eed983ea72f6c7b8b2a
      token: token,
    });
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
            <AccordionTrigger className="text-sm font-semibold flex items-center">
              <span>Lista de Diplomados</span>
              {/* <ChevronDown
                className="ml-2 transition-transform duration-200"
                aria-hidden="true"
                data-state-open="rotate-180"
              /> */}
            </AccordionTrigger>
            <AccordionContent>
<<<<<<< HEAD
              <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center mb-4">
                <div className="flex space-x-2">
                  <SearchGraduate placeholder="Buscar..." />
                </div>
              </div>
=======
            <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center mb-4">
              <div className="flex space-x-2">
                <SearchGraduate placeholder="Buscar..." />
              </div>
            </div>
>>>>>>> 92cd1691678b2b3939ca3eed983ea72f6c7b8b2a
              <div className="mt-3">
                <Suspense key={query + currentPage} fallback={<Skeleton />}>
                  <GraduateList
                    graduates={graduates}
                    currentPage={validPage}
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
        {selectedGraduateData.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">
              Detalles del Graduado Seleccionado
            </h3>
<<<<<<< HEAD
            <ul>
              {selectedGraduateData.map((corporation) => (
                <li key={corporation.id}>
                  <div>Corporación: {corporation.name}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* {selectedGraduateData.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">
              Detalles del Graduado Seleccionado
            </h3>
=======
>>>>>>> 92cd1691678b2b3939ca3eed983ea72f6c7b8b2a
            <ul>
              {selectedGraduateData.map((module) => (
                <li key={module.id}>
                  <span>
                    {module.name} - {module.startDate} to {module.endDate}
                  </span>
                  <div>Horas: {module.hours}</div>
                  <div>Temas: {module.topics.join(", ")}</div>
                  <div>Precio Total: ${module.totalPrice}</div>
                  <div>Estado: {module.state ? "Activo" : "Inactivo"}</div>
                  <h4 className="mt-2 font-semibold">Sesiones</h4>
                  <ul>
                    {module.session.map((session) => (
                      <li key={session.id} className="ml-4">
                        <div>Nombre de la Sesión: {session.name}</div>
                        <div>Enlace de Zoom: {session.linkZoom}</div>
                        <div>
                          Fecha: {new Date(session.date).toLocaleDateString()}
                        </div>
                        <div>
                          Orador:{" "}
                          {session.speaker ? session.speaker.fullName : "N/A"}
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )} */}
      </ContentLayout>
    </ProtectedRoute>
  );
};

export default ListGraduatePage;
