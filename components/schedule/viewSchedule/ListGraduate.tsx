"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from 'next/navigation';
//import { cookies } from "next/headers";
import { GraduateAllList } from "@/actions/ADMIN/getRoutes";
import Cookies from "js-cookie";

interface GraduateListProps {
  graduates: any[];
  currentPage: number;
  totalPages: number;
  totalGraduates: number;
}

const GraduateLIst = ({ graduates = [], currentPage, totalGraduates }: GraduateListProps) => {
  const router = useRouter();
  const limit = 10;
  console.log("currentPage", currentPage)
  const handleRowClick = (graduateId: number) => {
    router.push(`?graduateId=${graduateId}`); // Actualiza la URL para mostrar el graduateId
  };

  return (
    <div className="w-full mt-2">
      {/* <div>Número total de Diplomados: {totalGraduates}</div> */}
      <ScrollArea className="whitespace-nowrap rounded-md">
        <Table>
          <TableCaption>Lista de Diplomados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[100px]">Nro.</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-center">Créditos</TableHead>
              <TableHead className="text-center">Precio</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-center">Corporación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {graduates.length > 0 ? (
              graduates.map((graduate, index) => (
                <TableRow key={graduate.id} onClick={() => handleRowClick(graduate.id)} className="cursor-pointer hover:bg-gray-600">
                  <TableCell className="font-medium">
                    {graduate.id}
                  </TableCell>
                  <TableCell className="py-4">{graduate.name}</TableCell>
                  <TableCell className="text-center">{graduate.credits}</TableCell>
                  <TableCell className="text-center">{graduate.totalPrice}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={graduate.state ? "default" : "destructive"}>
                      {graduate.state ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {graduate.corporation.map((corp: any) => (
                      <div key={corp.corporation.id}>{corp.corporation.name}</div>
                    ))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Número total de Diplomados</TableCell>
<<<<<<< HEAD
             {/*  <TableCell colSpan={5}>Total en esta pagina</TableCell>
=======
              {/* <TableCell colSpan={5}>Total en esta pagina</TableCell>
>>>>>>> 92cd1691678b2b3939ca3eed983ea72f6c7b8b2a
              <TableCell className="text-right">{graduates.length}</TableCell> */}
              <TableCell className="text-right">{totalGraduates}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default GraduateLIst;

