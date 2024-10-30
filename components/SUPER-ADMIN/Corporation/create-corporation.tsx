"use client";
import React, { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { imageSchema } from "@/lib/image-schema";
import { createCorp } from "@/actions/create-edit-Corp-Institute";
import { useToast } from "@/hooks/use-toast";
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Campo requerido.",
  }),
  description: z.string().optional(),
  resolution: z.string().min(2, { message: "Campo requerido." }),
  ruc: z.string().min(2, { message: "Campo requerido." }),
  email: z
  .string()
  .min(1, { message: "Campo requerido." })
  .email("Esto no es un correo válido."),
  image: imageSchema,
});
export default function CreateCorporation() {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      resolution: "",
      ruc: "",
      email: "",
      image: null,
    },
  });

  async function createCorporation(data: any) {
    setLoading(true);
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("resolution", data.resolution);
    formData.append("ruc", data.ruc);
    formData.append("email", data.email);
    if (data.image) formData.append("image", data.image);
    try {
      await createCorp(formData);
      // Handle the result
      toast({
        title: "Corporación creada",
        description: "Corporación creada correctamente.",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error fasd:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la corporación.",
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Crear corporación</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Corporación</DialogTitle>
          <DialogDescription>
            Ingresa los datos de la nueva corporación y guarda los cambios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(createCorporation)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Corporación S.A." {...field} />
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
                  <FormLabel>Descripción <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Descripción" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resolución <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Resolución" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ruc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RUC <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="RUC" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      } // Capture file input
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-2">
              <Button disabled={loading} type="submit">{loading ? "Guardando..." : "Guardar"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
