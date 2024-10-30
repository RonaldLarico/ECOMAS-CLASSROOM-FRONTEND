import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/Authcontext";
import { DialogFooter } from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createStudentQuotesAction } from "@/actions/createStudnGradQuote";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Define payment method types for better type safety
type PaymentMethod =
  | "Preventa"
  | "En cuotas"
  | "Contado"
  | "Contado en 2 partes"
  | "Contado en 3 partes"
  | "Media beca"
  | "Beca completa"
  | "Diplomado E-learning";

// Payment configuration type
interface PaymentConfig {
  discountAmount: number | ((total: number) => number);
  installments: number;
}

// Payment method configurations
const PAYMENT_CONFIGS: Record<PaymentMethod, PaymentConfig> = {
  Preventa: { discountAmount: 150, installments: 1 },
  "En cuotas": { discountAmount: 0, installments: 5 },
  Contado: { discountAmount: 100, installments: 1 },
  "Contado en 2 partes": { discountAmount: 100, installments: 2 },
  "Contado en 3 partes": { discountAmount: 100, installments: 3 },
  "Media beca": { discountAmount: (total) => total * 0.5, installments: 5 },
  "Beca completa": { discountAmount: (total) => total, installments: 1 },
  "Diplomado E-learning": { discountAmount: 30, installments: 1 },
};

// Form schema
const formSchema = z.object({
  paymentMethod: z
    .string()
    .min(1, { message: "Por favor, selecciona un método de pago." }),
  totalPrice: z
    .string()
    .min(0, { message: "El precio total debe ser mayor a 0." }),
});

type FormData = z.infer<typeof formSchema>;

interface FinancialInfoFormProps {
  studentGraduateId: number | null;
  totalPrice: number;
  onClose: () => void;
}

function FinancialInfoForm({
  studentGraduateId,
  totalPrice,
  onClose,
}: FinancialInfoFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | "">("");
  const [quotasPrices, setQuotasPrices] = useState<number[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [installments, setInstallments] = useState(1);
  const { toast } = useToast();
  const { token } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "",
      totalPrice : "",
    },
  });

  const { handleSubmit, control, setValue } = form;

  useEffect(() => {
    setValue("totalPrice", totalPrice.toString());
  }, [totalPrice, setValue]);

  const calculateQuotes = (method: PaymentMethod) => {
    const config = PAYMENT_CONFIGS[method];
    if (!config) return;

    const newDiscountAmount =
      typeof config.discountAmount === "function"
        ? config.discountAmount(totalPrice)
        : config.discountAmount;

    setDiscountAmount(newDiscountAmount);
    setInstallments(config.installments);

    if (method === "Beca completa") {
      setQuotasPrices([]);
      return;
    }

    const finalCost = totalPrice - newDiscountAmount;
    const perInstallment = finalCost / config.installments;
    setQuotasPrices(Array(config.installments).fill(perInstallment));
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setError("");
    setSelectedMethod(method);
    calculateQuotes(method);
    setValue("paymentMethod", method);
  };

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    const submitData = new FormData();
    submitData.append("quantity", String(installments));
    submitData.append("discountAmount", String(discountAmount));
    submitData.append("studentGraduateId", String(studentGraduateId));
    submitData.append("token", token as string);
    submitData.append("paymentMethod", formData.paymentMethod);
    submitData.append("totalPrice", String(formData.totalPrice));

    try {
      await createStudentQuotesAction(submitData);
      toast({
        title: "Cuotas creadas con éxito",
        description: "Las cuotas se han creado correctamente.",
      });
      onClose();
    } catch (error) {
      console.error("Error creating quota:", error);
      toast({
        variant: "destructive",
        title: "Error al crear cuotas",
        description: "Hubo un error al crear las cuotas.",
      });
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderQuotasPrices = () => {
    if (!quotasPrices.length) return null;

    return (
      <div className="space-y-2">
        <FormLabel>Precios de cuotas</FormLabel>
        <div className="flex flex-wrap gap-2">
          {quotasPrices.map((price, index) => (
            <FormItem key={index} className="w-32">
              <FormControl>
                <Input
                  value={price.toFixed(2)}
                  readOnly
                  className="text-right"
                />
              </FormControl>
            </FormItem>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Información Financiera</h2>
          <div className="flex flex-wrap gap-4">
            <FormField
              control={control}
              name="totalPrice"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>Costo diplomado</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      {...field}
                      value={field.value.toString()}
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="self-end">
                  {selectedMethod || "Elige el método de pago"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={() => handlePaymentMethodSelect("Preventa")}
                  >
                    Preventa
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handlePaymentMethodSelect("En cuotas")}
                  >
                    En cuotas
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Al contado</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onSelect={() => handlePaymentMethodSelect("Contado")}
                        >
                          Contado
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handlePaymentMethodSelect("Contado en 2 partes")
                          }
                        >
                          Contado en 2 partes
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handlePaymentMethodSelect("Contado en 3 partes")
                          }
                        >
                          Contado en 3 partes
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Becas</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem
                          onSelect={() =>
                            handlePaymentMethodSelect("Media beca")
                          }
                        >
                          Media beca
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() =>
                            handlePaymentMethodSelect("Beca completa")
                          }
                        >
                          Beca completa
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem
                    onSelect={() =>
                      handlePaymentMethodSelect("Diplomado E-learning")
                    }
                  >
                    Diplomado E-learning
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {selectedMethod && (
            <div className="mt-6 space-y-4">
              <h2 className="font-semibold">{selectedMethod}</h2>
              {selectedMethod === "Beca completa" ? (
                <p className="text-sm text-muted-foreground">
                  La beca completa cubre todo el costo del diplomado.
                </p>
              ) : (
                renderQuotasPrices()
              )}
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="submit" disabled={!selectedMethod || loading}>
            {loading ? <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando</> : 'Guardar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default FinancialInfoForm;
