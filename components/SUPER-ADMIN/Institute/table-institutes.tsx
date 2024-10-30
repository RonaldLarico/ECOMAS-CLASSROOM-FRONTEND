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
import { Corporation, Institute } from "@/lib/definitions";
import EditInstitute from "./edit-institute";

export default async function TableInstitutes() {
  let data = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/institutes/`
  );
  let institutes = await data.json();

  //fetch corporations
  let dataCorporations = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/corporations/`
  );
  let corporations = await dataCorporations.json();
  corporations.map((corp: Corporation) => ({
    value: corp.id.toString(),
    label: corp.name,
  }));

  return (
    <>
      <ScrollArea className="whitespace-nowrap rounded-md ">
        <Table className="mt-2 overflow-auto w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Nro.</TableHead>
              <TableHead>Nombre de la institución</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Observación</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutes.map(( institutes: Institute) => (
              <TableRow key={institutes.id} className="cursor-pointer">
                <TableCell className="font-medium">{institutes.id}</TableCell>
                <TableCell>{institutes.name}</TableCell>
                <TableCell>{institutes.description}</TableCell>
                <TableCell>{institutes.observation}</TableCell>
                <TableCell>
                  <EditInstitute institute={institutes} corporations={corporations}/> 
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
