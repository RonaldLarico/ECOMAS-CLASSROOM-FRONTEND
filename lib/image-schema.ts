// utils/fileValidation.ts
import z from "zod";

const MAX_FILE_SIZE = 50000000; // 50MB

function checkFileType(file: File) {
  if (file?.name) {
    const fileType = file.name.split(".").pop()?.toLowerCase();
    return fileType === "jpeg" || fileType === "jpg" || fileType === "png";
  }
  return false;
}

export const imageSchema = z
  .instanceof(File)
  .refine(file => file.size <= MAX_FILE_SIZE, "El tamaño máximo de archivos es 50MB.")
  .refine(checkFileType, "Los archivos aceptados son .jpg, .png, .jpeg.")
  .optional();
