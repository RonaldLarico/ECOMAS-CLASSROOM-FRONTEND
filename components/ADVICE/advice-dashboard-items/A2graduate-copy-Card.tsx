import { Graduate } from "@/lib/definitions";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Image, Copy, CopyCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const GraduateCard = ({ graduate }: { graduate: any }) => {
  const firstModule = graduate.module[0];

  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex justify-between items-center">
          <Button
            asChild
            variant="ghost"
            className="text-xl w-full max-w-[calc(100%-130px)] p-0 h-auto"
          >
            <Link
              href={`/advice-dashboard/graduate?id=${graduate.id}`}
              className="block overflow-hidden justify-start"
            >
              <span className="inline-block max-w-full w-full truncate text-left">
                {graduate.id} - {graduate.name}
              </span>
            </Link>
          </Button>
          <Badge variant={graduate.state ? "default" : "secondary"}>
            {graduate.state ? "Activo" : "Inactivo"}
          </Badge>
        </div>
        <div className="flex justify-between items-start mt-2">
          <div className="flex flex-col">
            <div className="flex space-x-8 items-center justify-center mb-4">
              <div className="flex items-center">
                <Calendar className="mr-2" />
                <span>
                  Fecha de inicio:{" "}
                  {firstModule?.startDate.split("T")[0] || "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2" />
                <span>Participantes: {firstModule?.participants || "N/A"}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary" className="w-full">
                Copiar Extracto Prof.
              </Button>
              <Button variant="secondary">
                <Image />
              </Button>
            </div>
          </div>
          <div className="ml-4 flex items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="size-20" variant="ghost" >
                    <Copy />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copiar información del curso</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GraduateCard;
