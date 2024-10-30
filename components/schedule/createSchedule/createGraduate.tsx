"use client";
import React, { useEffect, useState } from "react";
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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { createGraduate } from "@/actions/ADMIN/postRoutes";
import Cookies from "js-cookie";

const corporations = [
  { id: 1, name: "ECOMAS" },
  { id: 2, name: "CIMADE" },
  { id: 3, name: "BINEX" },
  { id: 4, name: "PROMAS" },
  { id: 5, name: "SAYAN" },
  { id: 6, name: "RIZO" },
  { id: 7, name: "SEVEDA" },
  { id: 8, name: "INALTA" },
  { id: "all", name: "TODAS LAS CORPORACIONES" },
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Campo requerido." }),
  code: z.string().min(1, { message: "Campo requerido." }),
  totalPrice: z.number().min(1, { message: "Debe ser mayor a 0." }),
  credits: z.string().min(1, { message: "Campo requerido." }),
  state: z.boolean().default(false),
  checkImage: z.boolean().default(false),
  moduleId: z.array(z.number().optional()),
  corporationId: z.array(z.number()),
});

interface GraduateForm {
  name: string;
  code: string;
  totalPrice: number;
  credits: string;
  state: boolean;
  checkImage: boolean;
  moduleId?: number[];
  corporationId: number[];
}

const CreateGraduateForm = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [selectedCorporations, setSelectedCorporations] = useState<number[]>(
    []
  );
  const form = useForm<GraduateForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      totalPrice: 0,
      credits: "",
      state: false,
      checkImage: false,
      moduleId: [],
      corporationId: [],
    },
  });
  const handleCreateGraduate = async (data: GraduateForm) => {
    setLoading(true);
    try {
      await createGraduate({ ...data, corporationId: selectedCorporations });
      toast({
        title: "Diplomado creado",
        description: "El Diplomado ha sido creado correctamente.",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error al crear graduado:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el Diplomado.",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allCorporations = corporations
        .filter((corp) => typeof corp.id === "number")
        .map((corp) => corp.id as number);
      setSelectedCorporations(allCorporations);
    } else {
      setSelectedCorporations([]);
    }
  };

  const handleCorporationSelect = (id: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCorporations((prev) => [...prev, id]);
    } else {
      setSelectedCorporations((prev) => prev.filter((corpId) => corpId !== id));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Crear Diplomado</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] dark:bg-blue-950/80">
        <DialogHeader>
          <DialogTitle>Crear Diplomado</DialogTitle>
          <DialogDescription>
            Completa los datos para crear un nuevo Diplomado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateGraduate)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del graduado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Código <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Código" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Precio Total <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Precio Total"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Créditos <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Créditos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="corporationId"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Corporación <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="all-corporations">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={
                              selectedCorporations.length ===
                              corporations.filter(
                                (corp) => typeof corp.id === "number"
                              ).length
                            }
                            onCheckedChange={(checked) =>
                              handleSelectAll(checked as boolean)
                            }
                          />
                          <AccordionTrigger>
                            TODAS LAS CORPORACIONES
                          </AccordionTrigger>
                        </div>
                        <AccordionContent>
                          {corporations
                            .filter((corp) => typeof corp.id === "number")
                            .map((corp) => (
                              <div
                                key={corp.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  checked={selectedCorporations.includes(
                                    corp.id as number
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleCorporationSelect(
                                      corp.id as number,
                                      checked as boolean
                                    )
                                  }
                                />
                                <label>{corp.name}</label>
                              </div>
                            ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-2">
              <Button disabled={loading} type="submit">
                {loading ? "Creando..." : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGraduateForm;
