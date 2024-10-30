import React from "react";
import { Eye, FileCheck } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { PaymentRegister } from "@/lib/definitions";
import { Separator } from "@/components/ui/separator";

interface PaymentRegisterHoverProps {
  payments: PaymentRegister[];
}

const PaymentRegisterHover = ({ payments }: PaymentRegisterHoverProps) => {
  const formatDate = (date: string | Date) => {
    try {
      const dateObject = typeof date === "string" ? parseISO(date) : date;
      return format(dateObject, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      return "";
    }
  };

  return (
    <div className="flex items-center gap-1">
      {payments.map((payment, index) => (
        <HoverCard key={payment.id}>
          <HoverCardTrigger asChild>
            <button className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <FileCheck className="h-4 w-4 text-blue-500" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-blue-500">
                  Pago #{index + 1}
                </h4>
                <span className="text-xs text-gray-500">ID: {payment.id}</span>
              </div>
              <Separator className="" />
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-500">Banco</label>
                  <p className="text-sm font-medium">
                    {payment.nameBank || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Monto</label>
                  <p className="text-sm font-medium">
                    S/
                    {payment.amount || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Número de operación</label>
                  <p className="text-sm font-medium">
                    {payment.numberOperation || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Fecha</label>
                  <p className="text-sm font-medium">
                    {payment.date?.toString().split("T")[0] || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Fecha</label>
                  <p className="text-sm font-medium">
                    {payment.hour?.toString().split("T")[0] || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};

export default PaymentRegisterHover;
