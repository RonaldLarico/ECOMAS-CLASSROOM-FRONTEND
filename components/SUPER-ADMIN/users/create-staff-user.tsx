"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createStaffUser } from "@/actions/USERSTAFF/create-edit-staffUser";
import { useToast } from "@/hooks/use-toast";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  isValidPhoneNumber,
  formatPhoneNumber,
} from "react-phone-number-input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AutosizeTextarea } from "@/components/ui/auto-text-area";
import { Corporation } from "@/lib/definitions";
import { Role } from "@/lib/definitions";

const formSchema = z.object({
  documentNumber: z.string().regex(/^\d{8}$/, {
    message: "Debe tener 8 dígitos",
  }),
  password: z.string().min(6, { message: "Contraseña requerida." }),
  fullName: z.string().min(2, { message: "Nombre completo requerido." }),
  email: z.string().email({ message: "Email requerido." }),
  birthDate: z.string().optional(),
  phone: z
    .string()
    .refine((val) => val === "" || isValidPhoneNumber(val), {
      message: "Número de teléfono inválido",
    })
    .optional(),
  phoneOption: z
    .string()
    .refine((val) => val === "" || isValidPhoneNumber(val), {
      message: "Número de teléfono inválido",
    })
    .optional(),
  role: z.string().min(2, { message: "Rol requerido." }),
  bankName: z.string().optional(),
  numberBank: z.string().optional(),
  payment: z.number().optional(),
  paymentCorporation: z.string().optional(),
  observation: z.string().optional(),
  corporationId: z.number().optional(),
});

interface CreateStaffUserProps {
  corporations: Corporation[];
}

export default function CreateStaffUser({
  corporations,
}: CreateStaffUserProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentNumber: "",
      password: "",
      fullName: "",
      email: "",
      birthDate: "",
      phone: "",
      phoneOption: "",
      role: "",
      bankName: "",
      numberBank: "",
      payment: undefined,
      paymentCorporation: "",
      observation: "",
      corporationId: undefined as any,
    },
  });

  async function CreateUser(data: any) {
    console.log(data);
    //birthdate  in typoe Date for server
    if (data.birthDate) {
      data.birthDate = new Date(data.birthDate).toISOString(); // Formato ISO
    }

    setLoading(true);

    try {
      const response = await createStaffUser(data); 
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado correctamente.",
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el usuario." + error,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Añadir nuevo integrante</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Añadir nuevo integrante</DialogTitle>
          <DialogDescription>
            Ingresa los datos del nuevo integrante.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(CreateUser)}>
            <div className="flex w-full gap-2">
              <FormField
                control={form.control}
                name="documentNumber"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>DNI</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. 12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="w-1/4">Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Contraseña"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej. Juan Perez Gonzalez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Ej. ejm@ejemplo.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value} // Set the current form value
                        onChange={field.onChange} // Trigger form's onChange
                        placeholder="Número de teléfono"
                        defaultCountry="PE" // Set the default country as needed
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneOption"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Teléfono secundario</FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value} // Set the current form value
                        onChange={field.onChange} // Trigger form's onChange
                        placeholder="Número de teléfono"
                        defaultCountry="PE" // Set the default country as needed
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Rol</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Rol del usuario"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="ADMIN">Administración</SelectItem>
                          <SelectItem value="ADVISORY">Asesoría</SelectItem>
                          <SelectItem value="FINANCE">Finanzas</SelectItem>
                          <SelectItem value="ACCOUNTING">
                            Contabilidad
                          </SelectItem>
                          <SelectItem value="IMAGE">Imagen</SelectItem>
                          <SelectItem value="SUPER_ADMIN">
                            Super administrador
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="w-1/4">
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        type="date"
                        placeholder="Fecha de nacimiento"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Entidad bancaria (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del banco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="numberBank"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Número de cuenta (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de cuenta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="payment"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Honorarios (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Honorarios"
                        step="0.01"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentCorporation"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Empresa de pago (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Empresa de pago" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="corporationId"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Empresa a la que pertenece</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString() || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Corporación asignada"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {/* Map Corp id name here items */}
                          {corporations.map((corp) => (
                            <SelectItem
                              key={corp.id}
                              value={corp.id.toString()}
                            >
                              {corp.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="observation"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Observaciones o comentarios (opcional)
                    </FormLabel>
                    <FormControl>
                      <AutosizeTextarea
                        placeholder="Escribe aquí las observaciones o comentarios..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-2 ">
              <Button disabled={loading} type="submit" className="justify-end">
                {loading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
