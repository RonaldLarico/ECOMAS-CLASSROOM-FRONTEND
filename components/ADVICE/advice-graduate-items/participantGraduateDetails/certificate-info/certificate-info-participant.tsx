import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentGraduate } from "@/lib/definitions";
import React, { useState } from "react";

interface ParticipantCertificateGraduateInfoProps {
  participant: StudentGraduate | null;
}
export default function ParticipantCertificateGraduateInfo({
  participant,
}: ParticipantCertificateGraduateInfoProps) {
  if (!participant) return null;

  return (
    <div className="space-y-6 mt-4">
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
    </div>
  );
}
