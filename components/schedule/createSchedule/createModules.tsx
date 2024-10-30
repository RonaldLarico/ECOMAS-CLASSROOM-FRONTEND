"use client";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Trash2, UserPen } from "lucide-react";
import ModuleForm from "../components/moduleForm";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { createModule } from "@/actions/ADMIN/postRoutes";
import { FormattedData, SessionData } from "../components/interface/interface";

const CreateModules = () => {
  const [savedData, setSavedData] = useState<FormattedData | null>(null);

  const saveToLocalStorage = (data: FormattedData) => {
    localStorage.setItem("savedModules", JSON.stringify(data));
  };

  const handleSaveModule = (formattedData: FormattedData) => {
    setSavedData(formattedData);
    saveToLocalStorage(formattedData);
  };

  const handleCreateSchedule = async () => {
    if (!savedData) {
      console.error("No hay datos para crear el cronograma");
      return;
    }
    try {
      const { modules, numArrays, corporationIds, amountIds } = savedData;
      const sessionModuleMap = new Set();

      for (const mod of modules) {
        for (const session of mod.session) {
          const sessionKey = `${session.linkZoom}-${session.date}-${session.hour}`;
          if (sessionModuleMap.has(sessionKey)) {
            console.error("Sesión duplicada detectada:", sessionKey);
            throw new Error("Sesión duplicada detectada.");
          }
          sessionModuleMap.add(sessionKey);
        }
      }

      if (!numArrays || !corporationIds || !amountIds) {
        throw new Error(
          "Faltan campos necesarios: numArrays, corporationIds o amountIds."
        );
      }

      const allData = {
        modules,
        numArrays,
        corporationIds,
        amountIds,
      };

      await createModule(allData);
      console.log("allData: ", allData);
      console.log("Cronograma creado con éxito.");
    } catch (error) {
      console.error("Error al crear el cronograma:", error);
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("savedModules");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setSavedData(parsedData);
      console.log(parsedData);
    }
  }, []);

  const handleDelete = (moduleIndex: number) => {
    if (savedData) {
      const updatedModules = savedData.modules.filter(
        (_, i) => i !== moduleIndex
      );
      const updatedData = { ...savedData, modules: updatedModules };
      setSavedData(updatedData);
      saveToLocalStorage(updatedData);
    }
  };

  return (
    <div>
      <div>
        <ModuleForm onSaveModule={handleSaveModule} />
        {savedData && savedData.modules && savedData.modules.length > 0 && (
          <div className="flex justify-between mt-4">
            <h3 className="text-lg font-bold mb-2">Lista de Módulos:</h3>
            <Button variant="outline" onClick={handleCreateSchedule}>
              Crear Cronograma
            </Button>
          </div>
        )}
      </div>

      {savedData && savedData.modules && savedData.modules.length > 0 && (
        <div className="mt-2 p-4 border rounded-md w-auto overflow-x-auto">
          <Accordion type="multiple" className="w-full">
            {savedData.modules.map((moduleData, index) => (
              <AccordionItem
                key={index}
                value={`module-${index}`}
                className="w-full mb-4"
              >
                <AccordionTrigger className="w-full px-4 py-2 dark:bg-violet-900/30 hover:bg-gray-300 rounded-t-lg">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-base">
                        Módulo {index + 1}: {moduleData.name}
                      </h3>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="overflow-hidden transition-all duration-300">
                  <div className="overflow-x-auto px-2 dark:bg-blue-900/30 border-t space-y-2 rounded-b-lg">
                    <Table className="min-w-full mb-3">
                      <TableCaption>
                        Información de módulos y sesiones.
                      </TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[250px]">Módulo</TableHead>
                          <TableHead className="w-[250px]">Temario</TableHead>
                          <TableHead className="text-center w-[140px]">
                            Fecha
                          </TableHead>
                          <TableHead className="text-center">Hora</TableHead>
                          <TableHead className="">Ponente</TableHead>
                          <TableHead className="text-center">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      {moduleData.session && moduleData.session.length > 0 ? (
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium w-[350px]">
                              {moduleData.name}
                            </TableCell>
                            <TableCell>
                              {moduleData.topics.map(
                                (topic: string, i: number) => (
                                  <div key={i}>{topic}</div>
                                )
                              )}
                            </TableCell>
                            <TableCell>
                              <Table className="w-full text-center">
                                <TableBody>
                                  {moduleData.session.map(
                                    (
                                      session: SessionData,
                                      sessionIndex: number
                                    ) => (
                                      <TableRow key={sessionIndex}>
                                        <TableCell>
                                          {new Date(
                                            session.date
                                          ).toLocaleDateString("es-ES", {
                                            day: "2-digit",
                                            month: "numeric",
                                            year: "numeric",
                                          })}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </TableCell>
                            <TableCell>
                              <Table className="w-full text-center">
                                <TableBody>
                                  {moduleData.session.map(
                                    (
                                      session: SessionData,
                                      sessionIndex: number
                                    ) => (
                                      <TableRow key={sessionIndex}>
                                        <TableCell>
                                          {new Date(
                                            `1970-01-01T${session.hour}`
                                          ).toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          })}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </TableCell>
                            <TableCell>
                              <Table className="w-full">
                                <TableBody>
                                  {moduleData.session.map(
                                    (
                                      session: SessionData,
                                      sessionIndex: number
                                    ) => (
                                      <TableRow key={sessionIndex}>
                                        <TableCell>
                                          {session.speakerId || "N/A"}
                                        </TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </Table>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center gap-3">
                                <div
                                  role="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(index);
                                  }}
                                  className="text-green-600 hover:text-green-500 ml-2 hover:scale-x-125 duration-300"
                                >
                                  <UserPen className="w-6 h-6 shadow-md" />
                                </div>
                                <div
                                  role="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(index);
                                  }}
                                  className="text-red-600 hover:text-red-500 ml-2 hover:scale-125 duration-300"
                                >
                                  <Trash2 className="w-6 h-6 shadow-md" />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      ) : (
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">
                              Sin sesiones
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default CreateModules;
