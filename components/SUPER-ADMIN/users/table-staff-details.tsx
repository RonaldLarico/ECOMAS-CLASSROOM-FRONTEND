'use client';
import React, { useState } from "react";
import { User, Role } from "@/lib/definitions";
import { Badge } from "@/components/ui/badge";
import UserDetails from "./staff-details/staff-details";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";

function TableBodyClient({ users }: { users: User[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const columns: ColumnDef<User>[] = [
    {
      //counter
      accessorKey: "id",
      header: "Nro.",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "staff.fullName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full self-start"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre de usuario
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.staff?.fullName ?? "N/A"}</div>,
    },
    {
      accessorKey: "documentNumber",
      header: "DNI",
      cell: ({ row }) => <div>{row.original.documentNumber ?? "N/A"}</div>,
    },
    {
      accessorKey: "corporation.name",
      header: "Empresa",
      cell: ({ row }) => <div>{row.original.corporation?.name ?? "N/A"}</div>,
    },
    {
      accessorKey: "role",
      header: "Cargo",
      cell: ({ row }) => <div>{mapRole(row.original.role)}</div>,
    },
    {
      accessorKey: "state",
      header: "Estado",
      cell: ({ row }) => (
        <Badge variant={row.original.state ? "default" : "destructive"}>
          {row.original.state ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
  ];

  const mapRole = (role: Role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Administrador";
      case "ADMIN":
        return "Administración";
      case "ADVISORY":
        return "Asesoría";
      case "FINANCE":
        return "Finanzas";
      case "ACCOUNTING":
        return "Contabilidad";
      case "IMAGE":
        return "Imagen";
      default:
        return "Desconocido";
    }
  };

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full mt-2">
      <ScrollArea className="whitespace-nowrap rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => setSelectedUser(row.original)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
      {selectedUser && <UserDetails userId={selectedUser.id.toString()} />}
    </div>
  );
}

export default TableBodyClient;