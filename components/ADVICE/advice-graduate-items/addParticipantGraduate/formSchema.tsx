import { fileSchema } from "@/lib/file-schema";
import { z } from "zod";
import {
  isValidPhoneNumber,
} from "react-phone-number-input";

export const formSchema = z.object({
  id: z.number().optional(),
  fullName: z.string().min(1, { message: "Campo requerido." }),
  typeDocument: z.enum(["DNI", "PASSPORT", "OTHER"]).optional(),
  documentNumber: z.string().min(1, { message: "Campo requerido." }),
  address: z.string().optional(),
  gender: z.string().optional(),
  email: z
  .string()
  .min(1, { message: "Campo requerido." })
  .email("Esto no es un correo válido."),
  occupation: z.string().optional(),
  phone: z.string().refine((val) => isValidPhoneNumber(val), {
    message: "Número de teléfono inválido",
  }),
  phoneOption: z
    .string()
    .refine((val) => val === "" || isValidPhoneNumber(val), {
      message: "Número de teléfono inválido",
    })
    .optional(),
  birthDate: z.string().optional(),
  dniImage: fileSchema, // Apply file validation here
  form: fileSchema, // Apply file validation here
  imageTitle: fileSchema, // Apply file validation here
  observation: z.string().optional(),
})
.superRefine((values, ctx) => {
  const { typeDocument, documentNumber } = values;

  // Validación para DNI: exactamente 8 dígitos numéricos
  if (typeDocument === "DNI" && !/^[0-9]{8}$/.test(documentNumber)) {
    ctx.addIssue({
      path: ["documentNumber"],
      code: z.ZodIssueCode.custom,
      message: "DNI debe contener exactamente 8 dígitos numéricos",
    });
  }

  // Validación para Pasaporte: letras y números
  if (typeDocument === "PASSPORT" && !/^[a-zA-Z0-9]+$/.test(documentNumber)) {
    ctx.addIssue({
      path: ["documentNumber"],
      code: z.ZodIssueCode.custom,
      message: "Pasaporte debe contener solo letras y números",
    });
  }

});
