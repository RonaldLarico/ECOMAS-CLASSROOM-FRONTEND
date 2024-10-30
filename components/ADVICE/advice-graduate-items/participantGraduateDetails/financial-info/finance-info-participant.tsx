import React, { useState } from "react";
import { es } from "date-fns/locale";
import { FileCheck, FileWarning, PencilIcon, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StudentGraduate } from "@/lib/definitions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import EditQuotaForm from "./editQuota";
import FinancialInfoForm from "../../financial-info/FinancialInfoForm";
import { Switch } from "@/components/ui/switch";
import { deleteQuota } from "@/actions/ADVICE/DELETE/deleteQuota";
import { toast } from "@/hooks/use-toast";
import VerifyPaymentForm from "./verifyPayment";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, isBefore } from "date-fns";
import { updateStatusQuotaGraduate } from "@/actions/ADVICE/PATCH/patchUpdateQuotaStatus";
import { Card } from "@/components/ui/card";
import { QuotaGraduate } from "@/lib/definitions";
import { PaymentRegister } from "@/lib/definitions";
import PaymentRegisterHover from "./showPayment";
// Definimos los tipos de estado posibles
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
  variant: "success" | "secondary" | "warning" | "review";
} => {
  const configs = {
    pending: {
      text: "Pendiente",
      variant: "secondary" as const,
    },
    review: {
      text: "En Revisión",
      variant: "review" as const,
    },
    paid: {
      text: "Pagado",
      variant: "success" as const,
    },
    overdue: {
      text: "Vencido",
      variant: "warning" as const,
    },
  };

  return configs[status];
};
interface ParticipantFinancialInfoProps {
  participant: StudentGraduate | null;
  totalPrice: number;
  onUpdate?: () => Promise<void>;
}

export function ParticipantFinancialInfo({
  participant,
  totalPrice,
  onUpdate,
}: ParticipantFinancialInfoProps) {
  const [deletingQuotaId, setDeletingQuotaId] = useState<string | null>(null);
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [quotaToDelete, setQuotaToDelete] = useState<number | null>(null);

  const getVoucherStatus = React.useCallback((quota: QuotaGraduate) => {
    const vouchersCount = quota.vouchers?.length || 0;
    const paymentsCount = quota.paymentRegister?.length || 0;

    return {
      total: vouchersCount,
      verified: paymentsCount,
      pending: vouchersCount - paymentsCount,
    };
  }, []);

  const formatDate = React.useCallback((date: string | Date | undefined) => {
    if (!date) return "";
    try {
      const dateObject = typeof date === "string" ? parseISO(date) : date;
      const adjustedDate = new Date(dateObject);
      adjustedDate.setDate(adjustedDate.getDate() + 1);
      return format(adjustedDate, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      return "";
    }
  }, []);

  const handleUpdate = async () => {
    if (onUpdate) {
      await onUpdate();
    }
  };

  const handleDelete = async (quotaId: number) => {
    try {
      await deleteQuota(quotaId);
      toast({
        variant: "success",
        title: "Cuota eliminada con éxito",
        description: "La cuota se ha eliminado correctamente.",
      });
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description:
          "No se pudo eliminar la cuota. " +
          (error instanceof Error ? error.message : "Error desconocido"),
      });
    } finally {
      setQuotaToDelete(null);
    }
  };

  const handleStateChange = async (quotaId: number, newState: boolean) => {
    setIsUpdatingState(true);
    try {
      const response = await updateStatusQuotaGraduate(newState, quotaId);
      toast({
        variant: "success",
        title: "Estado actualizado",
        description: `La cuota ha sido marcada como ${
          newState ? "pagada" : "no pagada"
        }.`,
      });
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      toast({
        variant: "destructive",
        title: "Error al actualizar el estado",
        description: `No se pudo actualizar el estado de la cuota: ${errorMessage}`,
      });
      console.error("Error updating quota state:", error);
    } finally {
      setIsUpdatingState(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {participant?.quota?.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {participant.quota.map((quota) => (
            <Card className="p-2 shadow-md" key={quota.id}>
              <div className="space-y-2">
                {/* Name Section */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold ">{quota.name}</h3>
                  <div>
                    {(() => {
                      const status = getQuotaStatus(quota);
                      const { text, variant } = getStatusConfig(status);
                      return (
                        <Badge
                          variant={variant}
                          className="rounded-md px-2 py-1"
                        >
                          {text}
                        </Badge>
                      );
                    })()}
                  </div>
                </div>

                {/* Amount Section */}
                <div>
                  <Label className="text-sm font-medium text-gray-400">
                    Monto
                  </Label>
                  <Input readOnly value={quota.price} />
                </div>

                {/* Voucher Status Card */}
                <Card className="p-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {(() => {
                        const status = getVoucherStatus(quota);
                        return (
                          <div className="flex items-center gap-2">
                            {status.pending > 0 ? (
                              <Badge
                                variant="review"
                                className="flex items-center gap-1 rounded-md px-2 py-1"
                              >
                                <FileWarning className="h-3 w-3" />
                                <span className="text-xs">
                                  {status.pending} por verificar
                                </span>
                              </Badge>
                            ) : status.total > 0 ? (
                              <Badge
                                variant="success"
                                className="flex items-center gap-1 rounded-md px-2 py-1"
                              >
                                <FileCheck className="h-3 w-3" />
                                <span className="text-xs">Verificados</span>
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="rounded-md px-2 py-1"
                              >
                                <span className="text-xs">
                                  Sin comprobantes
                                </span>
                              </Badge>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="text-sm text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>Comprobantes:</span>
                        <span className="font-medium">
                          {getVoucherStatus(quota).total}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Verificados:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {getVoucherStatus(quota).verified}
                          </span>
                          {quota.paymentRegister &&
                            quota.paymentRegister.length > 0 && (
                              <PaymentRegisterHover
                                payments={quota.paymentRegister}
                              />
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Verify Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="w-full"
                      disabled={getVoucherStatus(quota).pending === 0}
                    >
                      {getVoucherStatus(quota).pending > 0
                        ? `Verificar ${
                            getVoucherStatus(quota).pending
                          } comprobante${
                            getVoucherStatus(quota).pending > 1 ? "s" : ""
                          }`
                        : "No hay comprobantes"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] max-w-[60vw] overflow-auto">
                    <DialogHeader>
                      <DialogTitle>Registrar pago</DialogTitle>
                      <DialogDescription>
                        Registra el pago de la cuota:{" "}
                        <span className="font-bold text-blue-500">
                          {quota.name}
                        </span>
                      </DialogDescription>
                    </DialogHeader>
                    <VerifyPaymentForm quota={quota} onSuccess={handleUpdate} />
                  </DialogContent>
                </Dialog>

                {/* Date and Observations */}
                <div>
                  <Label className="text-sm font-medium text-gray-400">
                    Fecha de pago
                  </Label>
                  <Input readOnly value={formatDate(quota.date)} className="" />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-400">
                    Observaciones
                  </Label>
                  <Textarea
                    readOnly
                    value={quota.observation || ""}
                    className="min-h-[60px]"
                  />
                </div>

                {/* Status and Actions */}
                <div className="flex items-center justify-end gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={quota.state}
                      onCheckedChange={(checked) =>
                        handleStateChange(quota.id, checked)
                      }
                      id={`quotaState-${quota.id}`}
                      disabled={isUpdatingState}
                      className={
                        isUpdatingState ? "cursor-wait" : "cursor-pointer"
                      }
                    />
                    <Label
                      htmlFor={`quotaState-${quota.id}`}
                      className="text-sm"
                    >
                      {quota.state ? "Pagado" : "No pagado"}
                    </Label>
                  </div>

                  <div className="flex gap-2">
                    <AlertDialog
                      open={quotaToDelete === quota.id}
                      onOpenChange={(open) => !open && setQuotaToDelete(null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="warning"
                          size="sm"
                          className="border-2 h-8 w-8 p-0 "
                          onClick={() => setQuotaToDelete(quota.id)}
                        >
                          <Trash className="" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirmar eliminación
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. ¿Estas seguro de
                            querer eliminar esta cuota?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setQuotaToDelete(null)}
                          >
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => quota.id && handleDelete(quota.id)}
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[40vw] max-h-[90vh] overflow-auto">
                        <DialogHeader>
                          <DialogTitle>Editar Cuota</DialogTitle>
                          <DialogDescription>
                            Modifica la información de la cuota:
                          </DialogDescription>
                        </DialogHeader>
                        <EditQuotaForm quota={quota} onSuccess={handleUpdate} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 justify-center my-8">
          <div className="text-3xl font-bold tracking-tight">
            No hay cuotas registradas
          </div>
          <div className="text-gray-400">
            Por favor, agrega la información financiera
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">Agregar información financiera</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Editar Información Financiera
                </DialogTitle>
                <DialogDescription>
                  Añade el método de pago que utilizará el participante:
                </DialogDescription>
              </DialogHeader>
              <FinancialInfoForm
                totalPrice={totalPrice}
                studentGraduateId={participant?.id || null}
                onClose={() => {
                  handleUpdate();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default ParticipantFinancialInfo;
