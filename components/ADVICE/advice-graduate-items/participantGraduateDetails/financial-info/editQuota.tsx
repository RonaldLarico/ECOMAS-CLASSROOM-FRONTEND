import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2, X, Check, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuotaGraduate } from "@/lib/definitions";
import { toast } from "@/hooks/use-toast";
import { editQuota } from "@/actions/ADVICE/PUT/putQuota";
import { deleteImageVoucher } from "@/actions/ADVICE/DELETE/deleteImageVoucher";
import { AutosizeTextarea } from "@/components/ui/auto-text-area";
import FileCard from "@/components/FILECARD/FileCard.tsx";
import { imageSchema } from "@/lib/image-schema";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  price: z.string().min(1, "El monto es requerido"),
  date: z.string().min(1, "La fecha es requerida"),
  observation: z.string().nullable(),
  vouchers: z.array(imageSchema).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditQuotaFormProps {
  quota: QuotaGraduate;
  onSuccess?: () => Promise<void>;
}

const EditQuotaForm: React.FC<EditQuotaFormProps> = ({ quota, onSuccess }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [existingImages, setExistingImages] = useState<string[]>(
    Array.isArray(quota.vouchers) ? quota.vouchers : []
  );
  const [initialExistingImages, setInitialExistingImages] = useState<string[]>(
    Array.isArray(quota.vouchers) ? quota.vouchers : []
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deletingImageIndex, setDeletingImageIndex] = useState<number | null>(
    null
  );
  //for user cannot be able to delete iamges that have payment registered
  const paymentRegistersCount = quota.paymentRegister?.length || 0;
  const canDeleteImage = existingImages.length > paymentRegistersCount;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: quota.name,
      price: quota.price.toString(),
      date: quota.date
        ? new Date(quota.date).toISOString().split("T")[0]
        : undefined,
      observation: quota.observation,
      vouchers: [],
    },
  });

  const isDirty =
    form.formState.isDirty ||
    existingImages.length !== initialExistingImages.length ||
    newFiles.length > 0 ||
    !existingImages.every((img, i) => img === initialExistingImages[i]);

  const handleReset = () => {
    form.reset({
      name: quota.name,
      price: quota.price.toString(),
      date: quota.date
        ? new Date(quota.date).toISOString().split("T")[0]
        : undefined,
      observation: quota.observation,
      vouchers: [],
    });
    setExistingImages(initialExistingImages);
    setNewFiles([]);
    setError("");
    setSuccess(false);
  };

  const confirmImageDeletion = async (index: number) => {
    if (!canDeleteImage) {
      toast({
        variant: "destructive",
        title: "No se puede eliminar",
        description:
          "No es posible eliminar comprobantes verificados con pagos registrados.",
      });
      setDeletingImageIndex(null);
      return;
    }
    try {
      setDeletingImageIndex(null); // Primero quitamos el estado de eliminación
      const imageUrl = existingImages[index];

      // Actualizamos el estado local antes de la llamada al servidor
      setExistingImages((prevImages) =>
        prevImages.filter((_, idx) => idx !== index)
      );

      // Llamada al servidor
      const response = await deleteImageVoucher(quota.id, imageUrl);

      toast({
        variant: "success",
        title: "¡Éxito!",
        description: "Comprobante eliminado correctamente.",
      });
      setSuccess(true);
    } catch (error) {
      // Si hay un error, revertimos el cambio local
      setExistingImages((prevImages) => {
        const newImages = [...prevImages];
        newImages.splice(index, 0, initialExistingImages[index]);
        return newImages;
      });

      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el comprobante.",
      });
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError("");

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        key !== "vouchers"
      ) {
        if (key === "date") {
          const isoDate = new Date(value as string).toISOString();
          formData.append(key, isoDate);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    newFiles.forEach((file) => {
      formData.append("vouchers", file);
    });

    try {
      const response = await editQuota(formData, quota.id);
      console.log("Response:", response);

      toast({
        variant: "success",
        title: "¡Hecho!",
        description: "Se ha actualizado la cuota con éxito.",
      });

      setSuccess(true);
      setInitialExistingImages(existingImages);
      form.reset(values);

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "No se pudo actualizar la cuota." +
          (error instanceof Error ? error.message : ""),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files).map((file) => {
        if (file.type.startsWith("image/")) {
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
          });
        }
        return file;
      });
      setNewFiles((prevFiles) => [...prevFiles, ...fileArray]);
      form.setValue("vouchers", [...newFiles, ...fileArray]);
    }
  };

  const removeNewFile = (indexToRemove: number) => {
    setNewFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter(
        (_, index) => index !== indexToRemove
      );
      form.setValue("vouchers", updatedFiles);
      return updatedFiles;
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>Cuota actualizada exitosamente</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input readOnly {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>Monto de la cuota</FormDescription>
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
                <FormDescription>
                  Fecha límite para realizar el pago
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="observation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observaciones</FormLabel>
                <FormControl>
                  <AutosizeTextarea
                    placeholder="Observaciones o comentarios..."
                    className=""
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vouchers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comprobantes de pago</FormLabel>

                {existingImages.length > 0 && (
                  <div className="grid gap-4 mb-4">
                    <p className="text-sm text-gray-500">
                      Comprobantes existentes:
                    </p>
                    {existingImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="border rounded-lg p-2">
                          <FileCard
                            imageUrl={`${process.env.NEXT_PUBLIC_API_BASE_URL}${imageUrl}`}
                            onRemove={() => setDeletingImageIndex(index)}
                          />
                          {deletingImageIndex === index && (
                            <div className="absolute top-4 right-2 flex gap-2 items-center">
                              ¿Eliminar?
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 bg-green-500 hover:bg-green-600"
                                onClick={() => confirmImageDeletion(index)}
                              >
                                Sí
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 bg-red-500 hover:bg-red-600"
                                onClick={() => setDeletingImageIndex(null)}
                              >
                                No
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {newFiles.length > 0 && (
                  <div className="grid gap-4 mb-4">
                    <p className="text-sm text-gray-500">
                      Nuevos comprobantes:
                    </p>
                    {newFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="border rounded-lg p-2">
                          <FileCard
                            file={file}
                            onRemove={() => removeNewFile(index)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <FormControl>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(e.target.files)}
                  />
                </FormControl>
                <FormDescription>
                  Seleccione nuevos comprobantes para agregar a los existentes
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading || !isDirty}
              onClick={handleReset}
            >
              Deshacer cambios
            </Button>
            <Button type="submit" disabled={isLoading || !isDirty}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditQuotaForm;
