import React from "react";
import { fetchGraduateData } from "@/actions/ADVICE/GET/getGraduateDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import AddParticipantModal from "./addParticipantGraduate/add-participant-modal";
import { Card, CardContent } from "@/components/ui/card";
import TableGraduateParticipants from "./participantGraduateDetails/Atable-graduate-participant";
import { Badge } from "@/components/ui/badge";

export default async function GraduateList({ id }: { id: string }) {
  const graduateDetails = await fetchGraduateData({
    id: id,
  });

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  const getModuleStatus = (startDate: string) => {
    const today = new Date();
    const moduleStart = new Date(startDate);

    if (today < moduleStart) {
      return <Badge variant="secondary">Pendiente</Badge>;
    }
    return <Badge variant="default">En curso</Badge>;
  };

  const getInstitutes = () => {
    if (!graduateDetails.corporation?.corporation?.institute) {
      return "No hay instituciones registradas";
    }

    return graduateDetails.corporation.corporation.institute
      .map((inst: any) => inst.institute.name)
      .join(", ");
  };

  if (!graduateDetails) {
    return <div>Error: No se pudieron cargar los datos del diplomado, intenta de nuevo más tarde.</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="w-9 mr-2" asChild>
            <Link href="/advice-dashboard/">
              <ArrowLeftIcon className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold mr-2">
            Diplomado: {graduateDetails.name || ""}
          </h1>
        </div>
        <AddParticipantModal
          graduateName={graduateDetails.name || ""}
          totalPrice={graduateDetails.totalPrice || 0}
          graduateId={parseInt(id)}
        />
      </div>
      <Card className="mt-2 p-2">
        <CardContent>
          <h4 className="text-lg font-semibold mb-2">
            Información del diplomado:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <h3 className="font-semibold">
                Fecha de inicio:{" "}
                <span className="font-normal">
                  {formatDate(graduateDetails.dateInit)}
                </span>
              </h3>
            </div>
            <div>
              <h3 className="font-semibold">
                Fecha de finalización:{" "}
                <span className="font-normal">
                  {formatDate(graduateDetails.dateFinish)}
                </span>
              </h3>
            </div>
            <div>
              <h3 className="font-semibold">
                Código del evento:{" "}
                <span className="font-normal">{graduateDetails.code}</span>
              </h3>
            </div>
            <div>
              <h3 className="font-semibold">
                Instituciones:{" "}
                <span className="font-normal">{getInstitutes()}</span>
              </h3>
            </div>
            <div>
              <h3 className="font-semibold">
                Costo del diplomado:{" "}
                <span className="font-normal">
                  S/ {graduateDetails.totalPrice || 0}
                </span>
              </h3>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">Módulo actual: </h3>
                <span className="font-normal">
                  {graduateDetails.module?.[0]?.name ||
                    "No hay módulo registrado"}
                </span>{" "}
                {graduateDetails.module?.[0]?.startDate &&
                  getModuleStatus(graduateDetails.module[0].startDate)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <TableGraduateParticipants graduateData={graduateDetails} />
    </>
  );
}
