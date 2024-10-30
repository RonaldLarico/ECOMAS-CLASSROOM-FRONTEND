"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import PersonalInfoForm from "./PersonalInfoForm";
import FinancialInfoForm from "../financial-info/FinancialInfoForm";
import { formSchema } from "./formSchema";
import { z } from "zod";
import { useAuth } from "@/context/Authcontext";
import { useToast } from "@/hooks/use-toast";
import { addParticipant } from "@/actions/ADVICE/POST/postStudentGraduate";

interface AddParticipantModalProps {
  graduateId: number;
  graduateName: string;
  totalPrice: number;
}

function AddParticipantModal({ graduateId, graduateName, totalPrice }: AddParticipantModalProps) {
  const { toast } = useToast();
  const [openPersonalModal, setOpenPersonalModal] = useState(false);
  const [openFinancialModal, setOpenFinancialModal] = useState(false);
  const [participantId, setParticipantId] = useState<number | null>(null);
  const [participantName, setParticipantName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      typeDocument: "DNI",
      documentNumber: "",
      address: "",
      email: "",
      occupation: "",
      phone: "",
      phoneOption: "",
      birthDate: undefined,
      dniImage: undefined,
      form: undefined,
      imageTitle: undefined,
      observation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        if (key === "birthDate") formData.append(key, new Date(value as string).toISOString());
        else formData.append(key, value as string);
      }
    });

    formData.append("password", "pollito123");

    try {
      const participantData = await addParticipant(formData, graduateId);
      setParticipantId(participantData.id);
      setParticipantName(participantData.fullName);
      form.reset();
      setOpenPersonalModal(false);
      toast({ title: "Participante guardado", description: "Se ha guardado el participante exitosamente" });
      setOpenFinancialModal(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al guardar el participante",
        description: `Ocurrio un error: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={openPersonalModal} onOpenChange={setOpenPersonalModal}>
        <DialogTrigger asChild>
          <Button className="w-full mt-2 md:mt-0 md:w-auto" onClick={() => setOpenPersonalModal(true)}>
            <CirclePlus className="mr-2" />
            Agregar participante
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[70vw] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Agregar participante en el diplomado: {graduateName}</DialogTitle>
            <DialogDescription>Ingresa los datos del participante en los siguientes campos:</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <PersonalInfoForm form={form} />
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => form.reset()}>
                  Limpiar datos
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar participante"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {participantId && (
        <Dialog open={openFinancialModal} onOpenChange={setOpenFinancialModal}>
          <DialogContent className="max-h-[90svh] overflow-auto max-w-[70vw]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Información Financiera del participante: {participantName}</DialogTitle>
              <DialogDescription>Añade el método de pago que utilizará el participante.</DialogDescription>
            </DialogHeader>
            <FinancialInfoForm studentGraduateId={participantId} totalPrice={totalPrice} onClose={() => setOpenFinancialModal(false)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default AddParticipantModal;
