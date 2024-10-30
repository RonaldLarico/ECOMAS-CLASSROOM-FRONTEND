import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Corporation } from "@/lib/definitions";
import EditCorporationDialog from "./edit-corporation";
import Image from "next/image";

export default async function TableCorporations() {
  let data = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/corporations/`
  );
  let corporations = await data.json();

  /*  Devuelve  Array(8) [
    {
      id: 1,
      name: 'ECOMAS',
      resolution: '13547986254',
      ruc: '2024789544',
      email: 'ecomas@gmail.com',
      image: '/api/v1/logo/1726788096264_ECOMAS-H.png', */
  return (
    <>
      <ScrollArea className="whitespace-nowrap rounded-md">
        <Table className="mt-2 overflow-auto w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Nro.</TableHead>
              <TableHead>Nombre de la empresa</TableHead>
              <TableHead>Nro. de resolución</TableHead>
              <TableHead>RUC</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Descripción</TableHead>
              {/*               <TableHead>Imagen</TableHead> */}
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {corporations.map((corporation: Corporation) => (
              <TableRow key={corporation.id} className="cursor-pointer">
                <TableCell className="font-medium">{corporation.id}</TableCell>
                <TableCell>{corporation.name}</TableCell>
                <TableCell>{corporation.resolution}</TableCell>
                <TableCell>{corporation.ruc}</TableCell>
                <TableCell>{corporation.email}</TableCell>
                <TableCell>{corporation.description}</TableCell>
                {/*                 <TableCell>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${corporation.image}`}
                    alt={`${corporation.name} logo`}
                    width={90}
                    height={100}
                    className="h-6 w-auto"
                  />
                </TableCell> */}

                <TableCell>
                  <EditCorporationDialog corporation={corporation} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}
