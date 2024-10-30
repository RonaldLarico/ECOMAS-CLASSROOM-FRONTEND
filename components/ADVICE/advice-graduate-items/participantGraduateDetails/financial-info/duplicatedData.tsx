// components/DuplicatePaymentAlert.tsx
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StudentGraduate } from "@/lib/definitions";
import { DuplicatePayment } from "@/lib/definitions";
interface DuplicatePaymentAlertProps {
  duplicatePayment: DuplicatePayment;
}

export const DuplicatePaymentAlert: React.FC<DuplicatePaymentAlertProps> = ({
  duplicatePayment,
}) => {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertTitle className="text-lg font-semibold">
        Pago Duplicado Detectado
      </AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-2">
          <p className="text-red-600 font-medium">{duplicatePayment.message}</p>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <p className="font-medium">Estudiante:</p>
              <p>{duplicatePayment.studentGraduate.fullName}</p>
              <p className="text-sm ">
                DNI: {duplicatePayment.studentGraduate.documentNumber}
              </p>
              <p className="text-sm ">
                Corporación:{" "}
                {
                  duplicatePayment.studentGraduate.corporation[0]?.corporation
                    .name
                }
              </p>
            </div>
            <div>
              <p className="font-medium">Detalles del Pago:</p>
              <p>Banco: {duplicatePayment.nameBank}</p>
              <p>Monto: S/ {duplicatePayment.amount}</p>
              <p>N° Operación: {duplicatePayment.numberOperation}</p>
              <p>
                Fecha: {duplicatePayment.date} {duplicatePayment.hour}
              </p>
            </div>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
