import React, { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SpeakerAllListSearch } from "@/actions/ADMIN/getRoutes";
import { SpeakerList } from "@/actions/ADMIN/interface/interface";
import Cookies from "js-cookie";
import { Combobox } from "@/components/ui/combobox";
import { ScrollArea } from "@/components/ui/scroll-area";

const sessionSchema = z.object({
  sessions: z.array(
    z.object({
      linkZoom: z.string().optional(),
      date: z.string().min(1, "La fecha es obligatoria"),
      hour: z.string().min(1, "La hora es obligatoria"),
      speakerId: z.number().optional(),
    })
  ),
});

const CreateSessionForm = ({
  setSessionData,
}: {
  setSessionData: (data: any) => void;
}) => {
  const formMethods = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      sessions: [
        {
          linkZoom: "",
          date: "",
          hour: "",
          speakerId: undefined,
        },
      ],
    },
  });

  const [numForms, setNumForms] = useState(1);
  const [speakers, setSpeakers] = useState<SpeakerList[]>([]);
  const [speakerSearchTerm, setSpeakerSearchTerm] = useState("");
  const [loadingSpeakers, setLoadingSpeakers] = useState(false);

  useEffect(() => {
    fetchSpeakers("");
  }, []);

  const fetchSpeakers = async (search: string) => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token no encontrado en las cookies");
      return;
    }
    setLoadingSpeakers(true);
    try {
      const result = await SpeakerAllListSearch({ token, search });
      console.log("Resultado de la API de ponentes:", result);
      setSpeakers(result);
      setLoadingSpeakers(false);
    } catch (error) {
      console.error("Error fetching speakers:", error);
      setLoadingSpeakers(false);
    }
  };

  const handleSpeakerInputChange = (value: string) => {
    setSpeakerSearchTerm(value);
    if (value.trim()) {
      fetchSpeakers(value);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: "sessions",
  });

  const handleSelectChange = (value: string) => {
    const selectedNum = Number(value);
    setNumForms(selectedNum);
    const currentLength = fields.length;

    if (selectedNum > currentLength) {
      for (let i = currentLength; i < selectedNum; i++) {
        append({ linkZoom: "", date: "", hour: "", speakerId: undefined });
      }
    } else if (selectedNum < currentLength) {
      for (let i = currentLength; i > selectedNum; i--) {
        remove(i - 1);
      }
    }
  };

  const formatDate = (date: string, time: string): string => {
    const combinedDate = new Date(`${date}T${time}:00.000Z`);
    return combinedDate.toISOString();
  };

  const handleSaveSession = () => {
    const sessionsData = formMethods.getValues("sessions").map((session) => ({
      ...session,
      date: formatDate(session.date, session.hour),
    }));
    setSessionData(sessionsData);
    console.log(sessionsData);
  };

  return (
    <FormProvider {...formMethods}>
      <div>
        <div className="mb-4 mt-8">
          <FormItem className="flex items-center space-x-3">
            <FormLabel className="whitespace-nowrap">
              Selecciona el número de sesiones:
            </FormLabel>
            <FormControl>
              <Select
                value={numForms.toString()}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="border border-gray-400 focus:border-blue-800 focus:ring w-16">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 15 }, (_, i) => (
                    <SelectItem key={i + 1} value={`${i + 1}`}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field, index) => (
            <form
              key={field.id}
              onSubmit={formMethods.handleSubmit((data) => {})}
              className="space-y-4 border border-gray-300 p-4 rounded-lg"
            >
              <h3 className="text-lg font-semibold">Sesión {index + 1}</h3>

              <FormField
                control={formMethods.control}
                name={`sessions.${index}.linkZoom`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link de Zoom (opcional):</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enlace de Zoom (opcional)"
                        {...field}
                        className="border border-gray-400 focus:border-blue-800 focus:ring focus:ring-blue-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name={`sessions.${index}.date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha:</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="border border-gray-400 focus:border-blue-800 focus:ring focus:ring-blue-200"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={formMethods.control}
                name={`sessions.${index}.hour`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora:</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} className="border border-gray-400 focus:border-blue-800 focus:ring focus:ring-blue-200"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formMethods.control}
                name={`sessions.${index}.speakerId`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Seleccionar Ponente</FormLabel>
                    <FormControl>
                      <Combobox
                        options={
                          speakers && speakers.length > 0
                            ? speakers.map((speaker) => ({
                                value: speaker.fullName,
                                label: speaker.fullName,
                              }))
                            : []
                        }
                        placeholder="Buscar Ponente ..."
                        onSelect={(selectedValue) => {
                          const selectedSpeaker = speakers.find(
                            (speaker) => speaker.fullName === selectedValue
                          );
                          if (selectedSpeaker) {
                            setSpeakerSearchTerm(selectedSpeaker.fullName);
                            field.onChange(selectedSpeaker.id);
                          }
                        }}
                        value={speakerSearchTerm || ""}
                        onInputChange={(value) => {
                          setSpeakerSearchTerm(value);
                          if (value.trim()) {
                            fetchSpeakers(value);
                          } else {
                            fetchSpeakers("");
                          }
                        }}
                        isLoading={loadingSpeakers}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          ))}
        </div>
        <Button className="mt-4" onClick={handleSaveSession}>
          Guardar todas las sesiones
        </Button>
      </div>
    </FormProvider>
  );
};

export default CreateSessionForm;
