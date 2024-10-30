import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { StudentGraduate } from "@/lib/definitions";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PasswordInput } from "@/components/ui/password-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { updatePassword } from "@/actions/ADVICE/PATCH/patchUpdatePassword";
import { updateStatusStudentGraduate } from "@/actions/ADVICE/PATCH/patchUpdateStatuStudentGraduate";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

interface ParticipantDetailsProps {
  participant: StudentGraduate | null;
  onUpdate?: () => Promise<void>; // Add update callback
}

export default function ParticipantAccessInfo({
  participant,
  onUpdate,
}: ParticipantDetailsProps) {
  const [loading, setLoading] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  if (!participant) {
    return null;
  }

  const handlePasswordUpdate = async (values: FormValues) => {
    try {
      setLoading(true);
      await updatePassword(values.password, participant.id);

      toast({
        title: "Contraseña actualizada",
        description: "La contraseña se actualizó correctamente.",
      });

      onUpdate?.();

      form.reset();
      setIsPasswordDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la contraseña. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      await updateStatusStudentGraduate(!participant.state, participant.id);

      toast({
        title: "Estado actualizado",
        description: "El estado de acceso se actualizó correctamente.",
      });

      onUpdate?.(); // Add this line to refresh data after status update

      setIsStatusDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="username">Nombre de usuario</Label>
          <Input
            id="username"
            readOnly
            value={participant.documentNumber ?? ""}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input id="password" readOnly value="******" type="password" />
        </div>

        <div className="flex items-end">
          <Dialog
            open={isPasswordDialogOpen}
            onOpenChange={setIsPasswordDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="secondary" className="w-full">
                Cambiar contraseña
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cambiar Contraseña</DialogTitle>
                <DialogDescription>
                  Cambia la contraseña para el participante, recomendable usar
                  su nombre de usuario.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handlePasswordUpdate)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nueva Contraseña</FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            placeholder="Nueva contraseña"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                        <FormControl>
                          <PasswordInput
                            {...field}
                            placeholder="Confirmar contraseña"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Actualizando..." : "Actualizar Contraseña"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch id="access-state" checked={participant.state} disabled />
          <Label htmlFor="access-state">Acceso al AULA VIRTUAL</Label>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="secondary">Cambiar estado</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cambiar estado de acceso</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás completamente seguro que deseas cambiar el estado de acceso al aula
                virtual?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={handleStatusUpdate} disabled={loading}>
                  {loading ? "Actualizando..." : "Confirmar"}
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
