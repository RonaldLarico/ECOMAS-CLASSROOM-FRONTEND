import * as z from "zod";

// Define MAX_FILE_SIZE in bytes (50MB)
const MAX_FILE_SIZE = 50000000;

function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop()?.toLowerCase();
    return fileType === "pdf" || fileType === "jpg" || fileType === "png";
  }
  return false;
}

export const fileSchema = z
  .instanceof(File)
  .refine(file => file.size <= MAX_FILE_SIZE, "El tamaño máximo de archivos es 50MB.")
  .refine(checkFileType, "Los archivos aceptados son .pdf, .jpg, .png.")
  .optional();