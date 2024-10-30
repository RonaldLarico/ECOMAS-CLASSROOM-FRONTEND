"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { imageSchema } from "@/lib/image-schema";
import { createInstitute } from "@/actions/create-edit-Corp-Institute";
import { useToast } from "@/hooks/use-toast";
import MultiSelect from "@/components/ui/multi-select";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

// Types
interface Corporation {
  id: string;
  name: string;
}

interface CreateInstituteProps {
  corporations: Corporation[];
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Form Schema with stricter validation and custom error message
const formSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre es requerido y debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  observation: z.string().optional(),
  corporationIds: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos una corporación"),
  image: imageSchema.optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateInstitute({
  corporations = [],
  onSuccess,
  onError,
}: CreateInstituteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      observation: "",
      corporationIds: [],
      image: undefined,
    },
  });

  const {
    reset,
    formState: { isValid, errors },
  } = form;

  const handleCorporationChange = (selected: string[]) => {
    console.log("handleCorporationChange", selected);
    form.setValue("corporationIds", selected, { shouldValidate: true });
  };

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleSubmit = async (data: FormValues) => {
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, complete todos los campos requeridos.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("name", data.name.trim());

      if (data.description) {
        formData.append("description", data.description.trim());
      }

      if (data.observation) {
        formData.append("observation", data.observation.trim());
      }

      if (data.corporationIds && data.corporationIds.length > 0) {
        data.corporationIds.forEach((id) => {
          formData.append("corporationId", id);
        });
      }

      if (data.image) {
        formData.append("image", data.image);
      }

      await createInstitute(formData);

      toast({
        title: "¡Éxito!",
        description: "La institución ha sido creada correctamente.",
      });

      onSuccess?.();
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating institute:", error);

      toast({
        variant: "destructive",
        title: "Error",
        description:
          "No se pudo crear la institución. Por favor, intente nuevamente.",
      });

      onError?.(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Crear institución</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear nueva institución</DialogTitle>
          <DialogDescription>
            Complete el formulario para crear una nueva institución. Los campos
            marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: Universidad Nacional"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descripción <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describa brevemente la institución"
                      disabled={isSubmitting}
                      className="min-h-[100px]"
                    />
                  </FormControl>
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
                    <Input
                      {...field}
                      placeholder="Observaciones adicionales"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="corporationIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Corporaciones <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <MultiSelect
                      values={corporations.map((corp) => ({
                        key: corp.id.toString(),
                        value: corp.name,
                      }))}
                      selected={field.value || []}
                      onChange={handleCorporationChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage>{errors.corporationIds?.message}</FormMessage>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files?.[0] || null)}
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
