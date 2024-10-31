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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { createGraduate } from "@/actions/ADMIN/postRoutes";
import Cookies from "js-cookie";
import { CorporationAllList } from "@/actions/ADMIN/getRoutes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Campo requerido." }),
  totalPrice: z.number().min(1, { message: "Debe ser mayor a 0." }),
  credits: z.string().min(1, { message: "Campo requerido." }),
  moduleId: z.array(z.number().optional()),
  corporationId: z.array(z.number()),
});

export interface GraduateForm {
  name: string;
  totalPrice: number;
  credits: string;
  moduleId?: number[];
  corporationId: number[];
}

const CreateGraduateForm = () => {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isIconOpen, setIsIconOpen] = useState(false);
  const { toast } = useToast();
  const [selectedCorporations, setSelectedCorporations] = useState<number[]>(
    []
  );
  const [corporations, setCorporations] = useState<
    { id: number; name: string }[]
  >([]);
  const form = useForm<GraduateForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      totalPrice: 0,
      credits: "",
      moduleId: [],
      corporationId: [],
    },
  });

  useEffect(() => {
    const fetchCorporations = async () => {
      try {
        const token = Cookies.get("token");
        const data = await CorporationAllList({ token: token || "" });
        setCorporations(data);
        const allCorporationIds = data.map((corp) => corp.id);
        setSelectedCorporations(allCorporationIds);
        form.setValue("corporationId", allCorporationIds);
      } catch (error) {
        console.error("Error fetching corporations:", error);
      }
    };
    fetchCorporations();
  }, [form]);

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

  const isAllSelected = selectedCorporations.length === corporations.length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-[300px] md:w-[200px]"
          onClick={() => setIsOpen(true)}
        >
          Crear Diplomado
        </Button>
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
              name="corporationId"
              render={() => (
                <FormItem className="w-full max-w-max mb-4">
                  <FormLabel>
                    Corporación: <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Popover onOpenChange={(open) => setIsIconOpen(open)}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex justify-between w-full"
                        >
                          {isAllSelected
                            ? "Todas las Corporaciones"
                            : "Seleccionar Corporaciones"}
                          <ChevronDown
                            className={`ml-2 transition-transform duration-200 ${
                              isIconOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            checked={isAllSelected}
                            className="h-5 w-5"
                            onCheckedChange={(checked) =>
                              handleSelectAll(checked as boolean)
                            }
                          />
                          <label>Todas las Corporaciones</label>
                        </div>
                        {corporations.map((corp) => (
                          <div
                            key={corp.id}
                            className="flex items-center text-sm space-x-2 space-y-1"
                          >
                            <Checkbox
                              checked={selectedCorporations.includes(corp.id)}
                              className="h-5 w-5"
                              onCheckedChange={(checked) =>
                                handleCorporationSelect(
                                  corp.id,
                                  checked as boolean
                                )
                              }
                            />
                            <label>{corp.name}</label>
                          </div>
                        ))}
                      </PopoverContent>
                    </Popover>
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
