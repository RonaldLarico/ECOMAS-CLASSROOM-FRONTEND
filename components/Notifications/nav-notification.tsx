"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Bell, BellRing, Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

const notifications = [
  {
    title: "Hay un nuevo diplomado.",
    description: "Hace 1 hora",
  },
  {
    title: "Tienes 5 váucher(s) a revisar",
    description: "Hace 1 hora",
  },
  {
    title: "El diplomado de SSOMA finalizó",
    description: "Hace 1 día",
  },
];

type CardProps = React.ComponentProps<typeof Card>;
export function NavNotification({ className, ...props }: CardProps) {
  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                className="rounded-full w-8 h-8 "
                variant="outline"
                size="icon"
              >
                <Bell className="w-[1.2rem] h-[1.2rem]   transition-transform ease-in-out duration-500  scale-100" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Notificaciones</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="border-0" align="end" forceMount>
        <Card className={cn("w-[500px]", className)} {...props}>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>Tienes 3 mensajes no leídos.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className=" flex items-center space-x-4 rounded-md border p-4">
              <BellRing />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Notificaciones entrantes
                </p>
                <p className="text-sm text-muted-foreground">
                  Enviar notificaciones al dispositivo.
                </p>
              </div>
              <Switch />
            </div>
            <div>
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Check className="mr-2 h-4 w-4" /> Marcar todo como leído
            </Button>
          </CardFooter>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
