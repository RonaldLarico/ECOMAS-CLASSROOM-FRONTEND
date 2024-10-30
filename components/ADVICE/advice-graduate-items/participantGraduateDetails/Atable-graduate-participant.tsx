"use client";
import React, { Suspense, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Graduate } from "@/lib/definitions";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import ParticipantDetails from "./Bparticipant-details";
import { MousePointerClick, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { isBefore } from "date-fns";

type QuotaStatus = "pending" | "review" | "paid" | "overdue";

const getQuotaStatus = (quota: any): QuotaStatus => {
  const currentDate = new Date();
  const dueDate = new Date(quota.date);

  // Si está marcado como pagado (state es true)
  if (quota.state) {
    return "paid";
  }

  // Si hay vouchers en revisión
  if (quota.vouchers && quota.vouchers.length > 0) {
    return "review";
  }

  // Si se pasó la fecha de pago y no está pagado
  if (isBefore(dueDate, currentDate) && !quota.state) {
    return "overdue";
  }

  // Estado pendiente por defecto
  return "pending";
};

const getStatusConfig = (
  status: QuotaStatus
): {
  text: string;
  variant: "successTable" | "secondary" | "destructive" | "reviewTable";
} => {
  const configs = {
    pending: {
      text: "Pendiente",
      variant: "secondary" as const,
    },
    review: {
      text: "En Revisión",
      variant: "reviewTable" as const,
    },
    paid: {
      text: "Pagado",
      variant: "successTable" as const,
    },
    overdue: {
      text: "Vencido",
      variant: "destructive" as const,
    },
  };

  return configs[status];
};

interface TableGraduateParticipantProps {
  graduateData: Graduate | null;
}

export default function TableGraduateParticipants({
  graduateData,
}: TableGraduateParticipantProps) {
  const [selectedParticipantId, setSelectedParticipantId] = useState<
    string | null
  >(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(8);

  const handleSelectParticipant = (participantId: string) => {
    setSelectedParticipantId(participantId);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Function to get quota amount by name or return "-" if not found
  const getQuotaAmount = (quotas: any[] | undefined) => {
    const quota = quotas?.find((q) => q.name);
    return quota ? `S/ ${parseFloat(quota.price).toFixed(2)}` : "-";
  };
  // Función para calcular el monto total pagado solo si la cuota está en estado "paid"
  const calculateTotalPaid = (quotas: any[] | undefined) => {
    if (!quotas || quotas.length === 0) return "-";

    // Filtrar cuotas que están en estado "paid"
    const total = quotas.reduce((sum, quota) => {
      const quotaStatus = getQuotaStatus(quota); // Obtener el estado de la cuota
      return quotaStatus === "paid" ? sum + parseFloat(quota.price) : sum;
    }, 0);

    return total > 0 ? `S/ ${total.toFixed(2)}` : "-"; // Retornar el total o "-" si es 0
  };

  // Function to check if student has a meaningful observation
  const hasObservation = (observation: string | undefined) => {
    return !!observation && observation.trim() !== "";
  };

  // Calculate pagination
  const totalItems = graduateData?.studentGraduate.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData =
    graduateData?.studentGraduate.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(<PaginationItem key="start-ellipsis">...</PaginationItem>);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<PaginationItem key="end-ellipsis">...</PaginationItem>);
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <TooltipProvider>
      <ScrollArea className="whitespace-nowrap rounded-md">
        <Table className="mt-2 overflow-auto w-max max-h-96">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Nro.</TableHead>
              <TableHead>Nombres y apellidos</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Primera Cuota</TableHead>
              <TableHead>Segunda Cuota</TableHead>
              <TableHead>Tercera Cuota</TableHead>
              <TableHead>Cuarta Cuota</TableHead>
              <TableHead>Certificación</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Condición</TableHead>
              <TableHead>Acceso al aula virtual</TableHead>
              <TableHead>Diploma impreso</TableHead>
              <TableHead>Diploma enviado</TableHead>
              <TableHead>Certificados modulares enviados</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map(({ studentGraduate }, index) => (
              <TableRow
                key={studentGraduate.id}
                onClick={() =>
                  handleSelectParticipant(studentGraduate.id.toString())
                }
                className="cursor-pointer"
              >
                <TableCell className="font-medium">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {studentGraduate.fullName}
                    {hasObservation(studentGraduate.observation) && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant="default"
                            className="rounded-full p-1"
                          >
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{studentGraduate.observation}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>{studentGraduate.documentNumber}</TableCell>
                {Array.from({ length: 5 }, (_, idx) => {
                  const quota = studentGraduate.quota[idx]; // Acceder a cada cuota por índice

                  if (!quota) return <TableCell key={idx}>-</TableCell>; // Si no hay cuota, muestra "-"

                  const quotaStatus = getQuotaStatus(quota); // Obtener el estado de la cuota
                  const { text, variant } = getStatusConfig(quotaStatus); // Obtener la configuración del estado

                  return (
                    <TableCell key={idx}>
                      <div className="flex items-center gap-2">
                        {getQuotaAmount([quota])}{" "}
                        {/* Mostrar la cantidad de la cuota */}
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant={variant}
                              className="rounded-full p-1"
                            >
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{text}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  );
                })}

                <TableCell>
                  {calculateTotalPaid(studentGraduate.quota)}
                </TableCell>
                <TableCell>
                  {studentGraduate.active ? "Aprobado" : "Desaprobado"}
                </TableCell>
                <TableCell>{studentGraduate.state ? "Sí" : "No"}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Pagination className="mt-4 justify-end">
        <PaginationContent>
          <PaginationItem>
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              Anterior
            </Button>
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Siguiente
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {selectedParticipantId ? (
        <ParticipantDetails
          key={selectedParticipantId}
          graduatePrice={graduateData?.totalPrice || 0}
          studentId={selectedParticipantId}
        />
      ) : (
        <div className="flex w-full items-center justify-center mt-2">
          <div className="flex flex-col items-center space-y-6">
            <MousePointerClick className="h-20 w-20" />
            <div className="space-y-2 text-center">
              <h1 className="text-4xl font-bold tracking-tight">
                Elige un Participante
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Para ver los detalles de un participante selecciona uno de la
                tabla.
              </p>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
  );
}
