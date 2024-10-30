import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import FileCard from "@/components/FILECARD/FileCard.tsx";

type PersonalInfoFormProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
};

function PersonalInfoForm({ form }: PersonalInfoFormProps) {
  // State to store file objects with previews
  const [dniFile, setDniFile] = useState<File | null>(null);
  const [formFile, setFormFile] = useState<File | null>(null);
  const [titleFile, setTitleFile] = useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "dniImage" | "form" | "imageTitle",
    setFileState: (file: File | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileState(file);
      form.setValue(fieldName, file);
    }
  };

  const handleFileRemove = (
    fieldName: "dniImage" | "form" | "imageTitle",
    setFileState: (file: File | null) => void
  ) => {
    setFileState(null);
    form.setValue(fieldName, undefined);
  };

  return (
    <div className="border p-2 rounded-sm">
      <h2 className="font-semibold mb-2">Información Personal</h2>
      {/* Previous form fields remain the same until the file inputs section */}
      <div className="md:flex gap-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="md:flex-1 w-full">
              <FormLabel>
                Nombres y apellidos <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Ej. Andrés Avelino Cáceres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="typeDocument"
          render={({ field }) => (
            <FormItem className="md:w-1/6 ">
              <FormLabel>Tipo de documento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                  <SelectItem value="OTHER">Otro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="documentNumber"
          render={({ field }) => (
            <FormItem className="nd:w-1/5">
              <FormLabel>
                Número de documento <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Ej. 00000000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Previous form fields remain the same */}
      <div className="flex flex-wrap gap-4 mt-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>
                Correo electrónico <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Ej. ejemplo@ejemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Ej. Av. Los Rosales Nro. 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem className="w-1/6">
              <FormLabel>Profesión</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Ingeniero" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex gap-4 mt-2">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem className="w-1/3">
              <FormLabel>
                Teléfono <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <PhoneInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Número de teléfono"
                  defaultCountry="PE"
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
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Número de teléfono"
                  defaultCountry="PE"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="w-1/3">
              <FormLabel>Fecha de nacimiento</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value || ""}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Updated file input section with FileCard */}
      <div className="flex flex-wrap gap-4 mt-2">
        <FormField
          control={form.control}
          name="dniImage"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem className="flex-1">
              <FormLabel>Documento de identidad</FormLabel>
              <div className="space-y-2">
                {dniFile && (
                  <div className="border rounded-lg p-2">
                    <FileCard
                      file={dniFile}
                      onRemove={() => handleFileRemove("dniImage", setDniFile)}
                    />
                  </div>
                )}
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, "dniImage", setDniFile)}
                    {...rest}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="form"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem className="flex-1">
              <FormLabel>Matrícula firmada</FormLabel>
              <div className="space-y-2">
                {formFile && (
                  <div className="border rounded-lg p-2">
                    <FileCard
                      file={formFile}
                      onRemove={() => handleFileRemove("form", setFormFile)}
                    />
                  </div>
                )}
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, "form", setFormFile)}
                    {...rest}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="imageTitle"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem className="flex-1">
              <FormLabel>Documento de estudios</FormLabel>
              <div className="space-y-2">
                {titleFile && (
                  <div className="border rounded-lg p-2">
                    <FileCard
                      file={titleFile}
                      onRemove={() => handleFileRemove("imageTitle", setTitleFile)}
                    />
                  </div>
                )}
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(e, "imageTitle", setTitleFile)}
                    {...rest}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="observation"
        render={({ field }) => (
          <FormItem className="w-full mt-2">
            <FormLabel>Observaciones</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Aquí puedes agregar alguna observación o comentarios."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default PersonalInfoForm;