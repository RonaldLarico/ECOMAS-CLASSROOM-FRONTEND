import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ImageIcon,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import * as z from "zod";
import { QuotaGraduate, StudentGraduate } from "@/lib/definitions";
import Image from "next/image";
import { createPaymentRegister } from "@/actions/ADVICE/POST/postPaymentRegister";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DuplicatePayment} from "@/lib/definitions";
import { DuplicatePaymentAlert } from "./duplicatedData";
// Componente para los controles de zoom
const Controls = () => {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  return (
    <div className="flex gap-2 absolute bottom-4 right-4 z-10">
      <Button
        variant="secondary"
        size="icon"
        onClick={() => zoomIn()}
        className="rounded-full"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => zoomOut()}
        className="rounded-full"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => resetTransform()}
        className="rounded-full"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Esquema de validación con Zod
const formSchema = z.object({
  nameBank: z.string().min(1, "El nombre del banco es requerido"),
  amount: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: "Monto debe ser un número.",
    }),
  numberOperation: z.string().optional(),
  date: z.string().min(1, "La fecha es requerida"),
  hour: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface VerifyPaymentFormProps {
  quota: QuotaGraduate;
  onSuccess?: () => Promise<void>;
}

const VerifyPaymentForm: React.FC<VerifyPaymentFormProps> = ({
  quota,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // Check if vouchers are available
  const noVouchersAvailable = !quota.vouchers || quota.vouchers.length === 0;

  const vouchersEqualtoPayments = quota.vouchers
    ? quota.vouchers.length === quota.paymentRegister.length
    : false;

    const [duplicatePayments, setDuplicatePayments] = useState<DuplicatePayment[]>([]);
    const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  

  useEffect(() => {
    if (quota.vouchers && quota.vouchers.length > 0) {
      const fullPath = `${process.env.NEXT_PUBLIC_API_BASE_URL}${quota.vouchers[0]}`;
      setCurrentImage(fullPath);
    }
  }, [quota.vouchers]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nameBank: "",
      amount: "",
      numberOperation: "",
      date: "",
      hour: "",
    },
  });
  //BANK OPTIONS

  const bankOptions = [
    "YAPE",
    "PLIN",
    "BCP",
    "BANCO DE LA NACIÓN",
    "BBVA",
    "INTERBANK",
    "SCOTIABANK",
    "Otro",
  ];
  const [otherBankName, setOtherBankName] = useState("");
  const { control, watch } = form;
  const watchedBank = watch("nameBank");

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setShowDuplicateAlert(false);
    setDuplicatePayments([]);

    try {
      const bankName = values.nameBank === "Otro" ? otherBankName : values.nameBank;

      const paymentData = {
        nameBank: bankName,
        amount: values.amount ? parseFloat(values.amount) : undefined,
        numberOperation: values.numberOperation || undefined,
        date: new Date(values.date),
        hour: values.hour,
        quotaGraduateId: quota.id,
      };

      const result = await createPaymentRegister(paymentData);
      
      // Check if result is an error object
      if (result && 'error' in result) {
        if (result.type === "DUPLICATE_PAYMENT" && 'duplicateDetails' in result) {
          setDuplicatePayments(result.duplicateDetails);
          setShowDuplicateAlert(true);
          
          toast({
            variant: "destructive",
            title: "Pago Duplicado",
            description: result.message,
          });
          return;
        }
        
        throw new Error(result.message);
      }

      toast({
        title: "Pago verificado",
        description: "El pago se ha registrado correctamente.",
      });

      if (onSuccess) {
        await onSuccess();
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo registrar el pago.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Time input handler
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    form.setValue("hour", newTime);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
      {/* Sección izquierda: Miniaturas de imágenes */}
      <div className="grid grid-cols-5 gap-4 items-start">
        <div className="hidden md:flex flex-col gap-3 items-start">
          {quota.vouchers?.map((image, index) => (
            <button
              key={index}
              className="border hover:border-gray-900 rounded-lg overflow-hidden transition-colors dark:hover:border-gray-50 focus:border-blue-500 focus:border-2"
              onClick={() =>
                setCurrentImage(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}${image}`
                )
              }
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${image}`}
                alt={`Preview thumbnail ${index + 1}`}
                width={100}
                height={120}
                className="aspect-[5/6] object-cover"
              />
            </button>
          )) || <p>No vouchers available</p>}
        </div>

        {/* Imagen principal con zoom */}
        <div className="md:col-span-4 relative max-h-[80vh] rounded-lg">
          {currentImage && (
            <TransformWrapper
              initialScale={1}
              initialPositionX={0}
              initialPositionY={0}
              minScale={0.5}
              maxScale={4}
              centerOnInit
              wheel={{ wheelDisabled: true }}
            >
              <Controls />

              <TransformComponent
                wrapperClass="!w-full !h-full"
                contentClass="!w-full !h-full"
              >
                <Image
                  src={currentImage}
                  alt="Product Image"
                  width={500}
                  height={500}
                  placeholder="blur" // Usar placeholder para mejorar la carga
                  blurDataURL="data:image/svg+xml;base64,..." // Imagen SVG de bajo peso como pre-carga
                  className="object-contain w-full h-full max-h-[70vh] border border-gray-200 rounded-lg overflow-hidden dark:border-gray-800"
                />
              </TransformComponent>
            </TransformWrapper>
          )}
        </div>

        {/* Message if no vouchers are available */}
        {noVouchersAvailable && (
          <div className="flex flex-col items-center justify-center gap-4 col-span-5">
            <div className="bg-gray-100 p-4 rounded-full dark:bg-gray-800">
              <ImageIcon className="h-12 w-12 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">
                No hay vouchers para registrar
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                No se ha encontrado ningún voucher para registrar.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sección derecha: Formulario */}
      <div className="flex flex-col gap-4 w-full">
        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="nameBank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nombre del Banco <span className="text-red-500">*</span>
                    </FormLabel>
                    <Controller
                      name="nameBank"
                      control={control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un banco" />
                          </SelectTrigger>
                          <SelectContent>
                            {bankOptions.map((bank) => (
                              <SelectItem key={bank} value={bank}>
                                {bank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormMessage>
                      {form.formState.errors.nameBank?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {watchedBank === "Otro" && (
                <FormItem>
                  <FormLabel>Otro Banco</FormLabel>
                  <Input
                    value={otherBankName.toUpperCase()}
                    onChange={(e) =>
                      setOtherBankName(e.target.value.toUpperCase())
                    }
                    placeholder="Ingrese el nombre del banco"
                  />
                </FormItem>
              )}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberOperation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de operación</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de pago</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de pago</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        step="1" // Enable seconds
                        value={time}
                        onChange={handleTimeChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isLoading || noVouchersAvailable || vouchersEqualtoPayments
                  } // Ya lo manejas bien
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registrando...
                    </>
                  ) : noVouchersAvailable ? (
                    "No hay vouchers"
                  ) : vouchersEqualtoPayments ? (
                    "Todos los vouchers han sido registrados"
                  ) : (
                    "Guardar pago"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          {/* Display duplicate payment alerts */}
          {showDuplicateAlert && duplicatePayments.length > 0 && (
            <div className="mt-4 space-y-2">
              {duplicatePayments.map((payment) => (
                <DuplicatePaymentAlert
                  key={payment.id}
                  duplicatePayment={payment}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-yellow-500">
            {" "}
            <AlertCircle className="" />
            <p className="text-sm">
              Recuerda registrar el pago o los pagos que hayan sido verificados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPaymentForm;
