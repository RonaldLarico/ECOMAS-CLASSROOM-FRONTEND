import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CorporationList,
  ModuleList,
} from "@/actions/ADMIN/interface/interface";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CorporationButtonsProps {
  corporations: CorporationList[];
  graduateId: string;
  graduateName: string;
  modules: ModuleList[];
}

const CorporationButtons: React.FC<CorporationButtonsProps> = ({
  corporations,
  graduateId,
  graduateName,
  modules,
}) => {
  return (
    <div>
      <div className="flex flex-wrap gap-1 mt-2 p-2 border border-blue-500 rounded-md w-full max-w-max">
        {corporations.map((corporation) => (
          <Link
            key={corporation.id}
            href={`?graduateId=${graduateId}&graduateName=${graduateName}&corporationId=${corporation.id}`}
          >
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-300 focus:bg-blue-300 focus:scale-90 transition-transform duration-300"
            >
              {corporation.name}
            </Button>
          </Link>
        ))}
      </div>
      {modules.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">
            Detalles del Graduado Seleccionado
          </h3>
          <Accordion type="multiple" className="space-y-2">
            {modules.map((module) => (
              <AccordionItem key={module.id} value={module.id.toString()}>
                <AccordionTrigger>
                  <span>{module.name}</span>
                </AccordionTrigger>
                <AccordionContent>
                <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Fecha de Inicio</TableHead>
                        <TableHead>Fecha de Finalización</TableHead>
                        <TableHead>Horas</TableHead>
                        <TableHead>Temas</TableHead>
                        <TableHead>Precio Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Sesión Nombre</TableHead>
                        <TableHead>Enlace de Zoom</TableHead>
                        <TableHead>Fecha Sesión</TableHead>
                        <TableHead>Hora Sesión</TableHead>
                        <TableHead>Orador</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {module.session.map((sessionWrapper, index) => {
                        const session = sessionWrapper.session;
                        return (
                          <TableRow key={`${module.id}-${session.id}-${index}`}>
                            {index === 0 && (
                              <>
                                <TableCell rowSpan={module.session.length}>{module.name}</TableCell>
                                <TableCell rowSpan={module.session.length}>{module.startDate}</TableCell>
                                <TableCell rowSpan={module.session.length}>{module.endDate}</TableCell>
                                <TableCell rowSpan={module.session.length}>{module.hours}</TableCell>
                                <TableCell rowSpan={module.session.length}>{module.topics.join(", ")}</TableCell>
                                <TableCell rowSpan={module.session.length}>${module.totalPrice}</TableCell>
                                <TableCell rowSpan={module.session.length}>{module.state ? "Activo" : "Inactivo"}</TableCell>
                              </>
                            )}
                            <TableCell>{session.name}</TableCell>
                            <TableCell>
                              <a href={session.linkZoom} target="_blank" rel="noopener noreferrer">
                                {session.linkZoom ? "Abrir Zoom" : "No disponible"}
                              </a>
                            </TableCell>
                            <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                            <TableCell>{session.hour}</TableCell>
                            <TableCell>{session.speaker ? session.speaker.fullName : "N/A"}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default CorporationButtons;
