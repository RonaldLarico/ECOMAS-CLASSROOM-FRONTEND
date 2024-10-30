import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dot,
  Copy,
  Calendar,
  Users,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export function DetallesCurso() {
  return (
    <div className="mt-2">
      <Card>
        <CardContent>
          <div className="flex justify-between items-center">
            <Button
              asChild
              variant="ghost"
              className="text-xl w-full max-w-[calc(100%-200px)] p-0 h-auto"
            >
              <Link
                href="/advice-dashboard/graduate"
                className="block overflow-hidden justify-start"
              >
                <span className="inline-block max-w-full w-full truncate text-left">
                Auditoria del Sistema de Gestión de Calidad e Inocuidad Alimentaria en base a la Norma ISO 19011
                </span>
              </Link>
            </Button>
            <div className="flex items-center ml-2 rounded-xl bg-[#FFF9E9] text-[#BF6A02] pr-2 text-sm font-bold">
              <Dot />
              [Estado curso]
            </div>
          </div>
          <div className="flex justify-between items-start mt-2">
            <div className="flex flex-col">
              <div className="flex space-x-8 items-center justify-center mb-4">
                <div className="flex items-center">
                  <Calendar className="mr-2" />
                  <span>Fecha de inicio:</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2" />
                  <span>Participantes matriculados:</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="secondary" className="w-full">
                  Copiar Extracto Prof.
                </Button>
                <Button variant="secondary" className="">
                  {/* Esto es un icono */}
                  <Image />
                </Button>
              </div>
            </div>
            <div className="ml-4 flex items-center justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-20">
                      <Copy className="size-16 p-3" />
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
    </div>
  );
}
