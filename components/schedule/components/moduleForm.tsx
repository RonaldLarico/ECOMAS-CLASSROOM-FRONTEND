"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import CreateSession from "../createSchedule/createSession";
import ChildrenFormModule from "./childrenFormModule";
import { createModule } from "@/actions/ADMIN/postRoutes";
import Cookies from "js-cookie";
import { Textarea } from "@/components/ui/textarea";
import { ExtendedModuleData, FormattedData, ModuleData, SessionData } from "./interface/interface";

const token = Cookies.get("token");

const sessionSchema = z.object({
  linkZoom: z.string().optional(),
  date: z.string().min(1, "La fecha es obligatoria"),
  hour: z.string().min(1, "La hora es obligatoria"),
  speakerId: z.string().optional(),
});

const moduleSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  hours: z.string().min(1, "Las horas son obligatorias"),
  totalPrice: z.number().min(0, "El precio total es obligatorio"),
  topics: z.array(z.string().min(1, "Debe ingresar al menos un tema")),
  graduateId: z.number(),
  session: z.array(sessionSchema),
  numArrays: z.number().min(1, "Número de cronograma es obligatorio"),
  corporationIds: z.array(z.number()),
  amountIds: z
    .array(z.number().min(0))
    .nonempty("Cantidad por corporación es obligatorio"),
});

interface ModuleFormDialogProps {
  onSaveModule: (module: FormattedData) => void;
}

const ModuleForm = ({ onSaveModule }: ModuleFormDialogProps) => {
  const form = useForm<ExtendedModuleData>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: "",
      hours: "",
      totalPrice: 0,
      topics: [""],
      graduateId: 0,
      session: [],
      numArrays: 4,
      corporationIds: [],
      amountIds: [2, 2, 2, 2],
    },
  });

  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData[] | null>(null);
  const [selectedCorporationIds, setSelectedCorporationIds] = useState<
    number[]
  >([]);
  const [savedModules, setSavedModules] = useState<ModuleData[]>([]);

  const handleCorporationsChange = (ids: number[]) => {
    setSelectedCorporationIds(ids);
    form.setValue("corporationIds", ids);
  };

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      const allData = { ...data, session: sessionData || data.session };
      const {
        numArrays,
        corporationIds,
        amountIds,
        graduateId,
        session,
        ...moduleData
      } = data;
      if (!numArrays || !corporationIds || !amountIds) {
        throw new Error(
          "Faltan los campos numArrays, corporationIds o amountIds en el módulo."
        );
      }

      const newModule = {
        ...moduleData,
        graduateId,
        session: sessionData || session,
      };

      const updatedModules = [...savedModules, newModule];

      const formattedData = {
        modules: updatedModules,
        numArrays,
        corporationIds: selectedCorporationIds,
        amountIds,
      };

      console.log("Datos guardados:", JSON.stringify(formattedData, null, 2));
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSaveModule(formattedData);
      setSavedModules(updatedModules);
      form.reset();
    } catch (error) {
      console.error("Error al guardar el módulo:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el Diplomado.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog>
      <div className="flex justify-between">
        <DialogTrigger asChild>
          <Button variant="outline">Agregar Módulos</Button>
        </DialogTrigger>
      </div>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[600px] lg:max-w-[900px] xl:max-w-[1200px] dark:bg-blue-950/80">
        <DialogHeader>
          <DialogTitle>Crear Módulo</DialogTitle>
          <DialogDescription>
            Completa los detalles del módulo. Haz clic en guardar cuando hayas
            terminado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              const formattedData = {
                ...data,
                topics: data.topics
                  .join("\n")
                  .split("\n")
                  .filter((topic) => topic.trim() !== ""),
              };
              handleSave(formattedData);
            })}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre:</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del módulo" {...field} className="border border-gray-400 focus:border-blue-800 focus:ring focus:ring-blue-200"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horas:</FormLabel>
                  <FormControl>
                    <Input placeholder="Duración en horas" {...field} className="border border-gray-400 focus:border-blue-800 focus:ring focus:ring-blue-200"/>
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
                  <FormLabel>Precio Total:</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        S/
                      </span>
                      <Input
                        type="number"
                        placeholder="Precio total"
                        {...field}
                        className="border border-gray-400 focus:border-blue-800 focus:ring focus:ring-blue-200 pl-10"
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                        value={
                          field.value === undefined || field.value === null
                            ? ""
                            : field.value
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topics"
              render={({ field }) => (
                <FormItem className="col-span-1 sm:col-span-2 md:col-span-3">
                  <FormLabel>Temario:</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingrese el temario, use '-' para temas y 'Tab' para subtemas opcionales"
                      className="textarea resize-none p-2 border rounded-md w-full h-full border-gray-400 focus:border-blue-800 focus:ring focus:ring-blue-200"
                      rows={1}
                      style={{ overflow: "hidden", minHeight: "50px" }}
                      value={field.value ? field.value.join("\n") : ""}
                      onKeyDown={(e) => {
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const text = e.target as HTMLTextAreaElement;
                          const start = text.selectionStart;
                          const end = text.selectionEnd;
                          const updatedText =
                            text.value.substring(0, start) +
                            "\t• " +
                            text.value.substring(end);

                          field.onChange(updatedText.split("\n"));
                          setTimeout(() => {
                            text.selectionStart = text.selectionEnd = start + 3;
                          }, 0);
                        }
                      }}
                      onChange={(e) => {
                        const textarea = e.target as HTMLTextAreaElement;
                        textarea.style.height = "auto";
                        textarea.style.height = `${textarea.scrollHeight}px`;
                        const topicsArray = textarea.value.split("\n");
                        field.onChange(topicsArray);
                      }}
                      onBlur={() => {
                        if (Array.isArray(field.value)) {
                          const formattedTopics = field.value
                            .filter((line: string) => line.trim() !== "")
                            .map((topic: string) => topic.trim());

                          field.onChange(formattedTopics);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <CreateSession setSessionData={setSessionData} />
        <DialogFooter>
          <Button
            type="submit"
            onClick={form.handleSubmit((data) => {
              console.log("click");
              setIsSaving(true);
              handleSave(data).finally(() => {
                setIsSaving(false);
              });
            })}
          >
            {isSaving ? "Guardando..." : "Guardar Módulo"}
          </Button>
        </DialogFooter>
      </DialogContent>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="flex justify-center gap-4 py-4 border-t mt-5"
        >
          <ChildrenFormModule
            control={form.control}
            token={token || ""}
            onCorporationsChange={handleCorporationsChange}
          />
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default ModuleForm;
