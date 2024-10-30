import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";
import PersonalInfoForm from "../addParticipantGraduate/PersonalInfoForm";
import { formSchema } from "../addParticipantGraduate/formSchema";
import z from "zod";
import { editStudentGraduate } from "@/actions/ADVICE/PUT/putGraduateStudent";
import { StudentGraduate } from "@/lib/definitions";
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
import { Form } from "@/components/ui/form";

type FormValues = z.infer<typeof formSchema>;

interface EditParticipantModalProps {
  participantData: FormValues;
  onParticipantUpdate: (updatedData: StudentGraduate) => void;
}

const EditParticipantModal: React.FC<EditParticipantModalProps> = ({
  participantData,
  onParticipantUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: participantData.id,
      fullName: participantData.fullName || "",
      typeDocument: participantData.typeDocument,
      documentNumber: participantData.documentNumber || "",
      address: participantData.address || "",
      email: participantData.email || "",
      occupation: participantData.occupation || "",
      phone: participantData.phone || "",
      phoneOption: participantData.phoneOption || "",
      birthDate: participantData.birthDate
        ? new Date(participantData.birthDate).toISOString().split("T")[0]
        : undefined,
      dniImage: undefined,
      form: undefined,
      imageTitle: undefined,
      observation: participantData.observation || "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      const formIsDirty = form.formState.isDirty;

      const hasFieldChanges = Object.entries(value).some(([key, val]) => {
        const initialValue = participantData[key as keyof FormValues];
        // Check if the field was changed from a value to empty or vice versa
        if (!val && initialValue) return true;
        if (val && !initialValue) return true;
        return val !== initialValue;
      });

      const hasFileChanges = Object.entries(value).some(([key, val]) => {
        return val instanceof File && val !== undefined;
      });

      setHasChanges(formIsDirty || hasFieldChanges || hasFileChanges);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, form.formState, participantData]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const formData = new FormData();

    // Add a flag to indicate which fields were explicitly cleared
    const clearedFields = new Set<string>();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "id") return;

      // Check if the field was explicitly cleared (changed from having a value to empty)
      if (
        (!value || value === "") &&
        participantData[key as keyof FormValues]
      ) {
        clearedFields.add(key);
        formData.append(`${key}_cleared`, "true"); // Add a flag to indicate this field was cleared
      }

      // Always append the current value, even if it's empty
      if (value instanceof File) {
        formData.append(key, value);
      } else if (key === "birthDate" && value) {
        const isoDate = new Date(value as string).toISOString();
        formData.append(key, isoDate);
      } else {
        // Append empty string for cleared fields, otherwise append the value
        formData.append(key, value?.toString() ?? "");
      }
    });

    try {
      const response = await editStudentGraduate(formData, participantData.id);
      toast({
        title: "Participante actualizado",
        description: "El participante se actualizo correctamente.",
      });
      onParticipantUpdate(response);
      setHasChanges(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el participante.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setHasChanges(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">
          {" "}
          <Edit className="mr-2" />
          Modificar información personal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[70vw] overflow-auto">
        <DialogHeader>
          <DialogTitle>Editar Participante</DialogTitle>
          <DialogDescription>
            Modifica los detalles del participante. Guarda los cambios cuando
            termines.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PersonalInfoForm form={form} />
            <DialogFooter>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={!hasChanges}
                >
                  Deshacer Cambios
                </Button>

                <Button type="submit" disabled={loading || !hasChanges}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditParticipantModal;
