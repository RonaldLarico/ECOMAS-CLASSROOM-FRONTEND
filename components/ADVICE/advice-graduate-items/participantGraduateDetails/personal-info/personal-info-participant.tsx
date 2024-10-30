import React from "react";
import { Copy, Eye, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StudentGraduate } from "@/lib/definitions";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface ParticipantDetailsProps {
  participant: StudentGraduate | null;
}

export default function ParticipantPrimaryInfo({
  participant,
}: ParticipantDetailsProps) {
  if (!participant) return null;

  // Función para abrir PDFs en una nueva pestaña
  const openPdf = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

  // Función para determinar si es una imagen
  const isImage = (fileUrl: string) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileUrl);
  };


  // Función para formatear fechas
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "";
    try {
      const dateObject = typeof date === "string" ? parseISO(date) : date;
      // Add one day to compensate for timezone offset
      const adjustedDate = new Date(dateObject);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      return format(adjustedDate, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="mt-4">
      {/* Información básica */}
      <div className="flex gap-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="dni">Número de DNI</Label>
          <Input readOnly value={participant.documentNumber ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input readOnly value={participant.email ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="profesion">Profesión</Label>
          <Input readOnly value={participant.occupation ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="code">Código</Label>
          <Input readOnly value={participant.code ?? ""} />
        </div>
      </div>

      {/* Detalles adicionales */}
      <div className="flex gap-4 mt-2">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="phones">Celular principal</Label>
          <Input readOnly value={participant.phone ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="phones">Celular secundario</Label>
          <Input readOnly value={participant.phoneOption ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="birthdate">Fecha de nacimiento</Label>
          <Input readOnly value={formatDate(participant.birthDate)} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="address">Dirección</Label>
          <Input readOnly value={participant.address ?? ""} />
        </div>
      </div>

      {/* Visualización de archivos */}
      <div className="flex gap-4 mt-2">
        {/* Foto DNI */}
        <div className="relative grid w-full items-center gap-1.5">
          <Label htmlFor="dniPhoto">Foto DNI</Label>
          <div className="relative">
            <Input
              readOnly
              value={participant.dniImage?.split("/").pop() ?? ""}
              className="pr-10"
            />
            {participant.dniImage && isImage(participant.dniImage) ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    variant="ghost"
                  >
                    <Eye />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl border-0 bg-transparent p-0">
                  <DialogTitle>Documento de identidad</DialogTitle>
                  <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-md mt-2">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${participant.dniImage}`}
                      fill
                      alt={"Foto DNI"}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                variant="ghost"
                onClick={() =>
                  openPdf(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}${participant.dniImage}`
                  )
                }
              >
                <Eye />
              </Button>
            )}
          </div>
        </div>

        {/* Matrícula firmada */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="matricula">Ficha de matrícula</Label>
          <div className="relative">
            <Input
              readOnly
              value={participant.form?.split("/").pop() ?? ""}
              className="pr-10"
            />
            {participant.form && isImage(participant.form) ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    variant="ghost"
                  >
                    <Eye />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl border-0 bg-transparent p-0">
                  <DialogTitle>Ficha de matrícula</DialogTitle>
                  <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-md">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${participant.form}`}
                      fill
                      alt={"Matrícula firmada"}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                variant="ghost"
                onClick={() =>
                  openPdf(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}${participant.form}`
                  )
                }
              >
                <Eye />
              </Button>
            )}
          </div>
        </div>

        {/* Documento de estudios */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="imageTitle">Documento de estudios</Label>
          <div className="relative">
            <Input
              readOnly
              value={participant.imageTitle?.split("/").pop() ?? ""}
              className="pr-10"
            />
            {participant.imageTitle && isImage(participant.imageTitle) ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    variant="ghost"
                  >
                    <Eye />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl border-0 bg-transparent p-0">
                  <DialogTitle>Documento de estudios</DialogTitle>
                  <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent shadow-md">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${participant.imageTitle}`}
                      fill
                      alt={"Documento de estudios"}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer"
                variant="ghost"
                onClick={() =>
                  openPdf(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}${participant.imageTitle}`
                  )
                }
              >
                <Eye />
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Observaciones */}
      <div className="flex gap-4 mt-2">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="observation">Observaciones o comentarios</Label>
          <Textarea readOnly value={participant.observation ?? ""} />
        </div>
      </div>
    </div>
  );
}
