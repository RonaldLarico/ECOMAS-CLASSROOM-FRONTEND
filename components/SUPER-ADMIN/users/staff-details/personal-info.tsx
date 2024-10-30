import React from "react";
import { User } from "@/lib/definitions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AutosizeTextarea } from "@/components/ui/auto-text-area";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
function PersonalInfo({ user }: { user: User | null }) {
  if (!user) {
    return <p>No user data available.</p>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-2 text-purple-300">
        Información Personal
      </h3>

      {/* Información Personal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="fullName">Nombres y apellidos</Label>
          <Input readOnly value={user?.staff?.fullName ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input readOnly value={user?.staff?.email ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="phone">Número de celular</Label>
          <Input readOnly value={user?.staff?.phone ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="birthDate">Fecha de nacimiento</Label>
          <Input
            readOnly
            value={
              user?.staff?.birthDate
                ? new Date(user?.staff.birthDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "No disponible"
            }
          />
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-4 text-purple-300">
        Información Financiera
      </h3>
      {/* Información Financiera */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="bankName">Banco</Label>
          <Input readOnly value={user?.staff?.bankName ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="numberBank">Número de cuenta</Label>
          <Input readOnly value={user?.staff?.numberBank ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="payment">Honorarios</Label>
          <Input readOnly value={user?.staff?.payment ?? ""} />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="paymentCorporation">Empresa de pago</Label>
          <Input readOnly value={user?.staff?.paymentCorporation ?? ""} />
        </div>
        <div className="grid grid-cols-1 gap-1.5">
        <Label htmlFor="paymentCorporation">Acceso al sistema</Label>
        <div className="flex items-center space-x-2  mb-1">
          <Switch
            id="state"
            checked={user?.state}
            /* onCheckedChange={} */
          ></Switch>
          <Label htmlFor="state">{user?.state ? "Activo" : "Inactivo"}</Label>
        </div>
      </div>
      </div>
      {/* Observaciones */}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="observation">Observaciones</Label>
        <AutosizeTextarea
          placeholder="Escribe aquí las observaciones o comentarios..."
          value={user?.staff?.observation ?? ""}
        />
      </div>

    </div>
  );
}

export default PersonalInfo;
