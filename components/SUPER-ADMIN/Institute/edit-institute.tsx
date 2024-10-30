"use client";
import React, { useState, useEffect } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { editInstitute } from "@/actions/create-edit-Corp-Institute";
import { useToast } from "@/hooks/use-toast";
import MultiSelect from "@/components/ui/multi-select";
import { Institute, Corporation } from "@/lib/definitions";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  description: z.string().optional(),
  observation: z.string().optional(),
  corporationIds: z
    .array(z.string())
    .min(1, { message: "Elige al menos una corporación." }), // Changed from nonempty to min(1)
  image: z
    .any()
    .refine(
      (file) => !file || file instanceof File,
      "El archivo debe ser una imagen válida."
    )
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "El archivo no debe superar los 5MB."
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Solo se permiten archivos .jpg, .jpeg, .png y .webp"
    )
    .nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditInstituteProps {
  institute: Institute;
  corporations: Corporation[];
}

export default function EditInstitute({
  institute,
  corporations = [],
}: EditInstituteProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: institute?.name || "",
      description: institute?.description || "",
      observation: institute?.observation || "",
      corporationIds:
        institute.corporation?.map((corporation) =>
          String(corporation.corporationId)
        ) || [],
      image: null,
    },
  });

  // Update selected corporations when MultiSelect changes
  const handleCorporationChange = (selected: string[]) => {
    console.log(selected);
    form.setValue("corporationIds", selected, { shouldValidate: true });
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        name: institute?.name || "",
        description: institute?.description || "",
        observation: institute?.observation || "",
        corporationIds:
          institute.corporation?.map((corporation) =>
            String(corporation.corporationId)
          ) || [],
        image: null,
      });
    }
  }, [isOpen, form, institute]);

  async function handleEditInstitute(data: FormValues) {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", data.name.trim());
      if (data.description) {
        formData.append("description", data.description.trim());
      }
      if (data.observation) {
        formData.append("observation", data.observation.trim());
      }
      // Ensure we have at least one corporation
      if (data.corporationIds.length === 0) {
        throw new Error("Debe seleccionar al menos una corporación");
      }

      data.corporationIds.forEach((id) =>
        formData.append("corporationId", id)
      );

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      await editInstitute(formData, institute.id);

      toast({
        title: "Institución actualizada",
        description: "Los cambios se guardaron correctamente.",
      });

      setIsOpen(false);
    } catch (error) {
      console.error("Error al actualizar la institución:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar la institución. Por favor, intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="p-2"
          aria-label="Editar institución"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
            <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
            <path d="M16 5l3 3" />
          </svg>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar institución</DialogTitle>
          <DialogDescription>
            Modifica los datos de la institución y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEditInstitute)}
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
                      placeholder="Nombre de la institución"
                      {...field}
                      disabled={loading}
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
                      placeholder="Descripción de la institución"
                      {...field}
                      disabled={loading}
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
                      placeholder="Observaciones adicionales"
                      {...field}
                      disabled={loading}
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
                      selected={field.value}
                      onChange={handleCorporationChange}
                      disabled={loading}
                      error={!!form.formState.errors.corporationIds}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Logo de la institución</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                        onChange={(e) => onChange(e.target.files?.[0] || null)}
                        disabled={loading}
                        {...field}
                      />
                      {institute.image && (
                        <div className="text-sm text-gray-500">
                          <p>
                            Imagen actual: {institute.image.split("/").pop()}
                          </p>
                        </div>
                      )}
                    </div>
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
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
