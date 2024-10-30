import React from "react";
import { FileTextIcon } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileCardProps {
  file?: File; // Ahora el archivo es opcional
  imageUrl?: string; // URL de la imagen como nueva opción
  onRemove: () => void;
  progress?: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Esta función verifica de forma segura si el archivo tiene la propiedad preview
function hasFilePreview(file: File): file is File & { preview: string } {
  return (file as File & { preview: string }).preview !== undefined;
}

interface FilePreviewProps {
  file?: File;
  imageUrl?: string; // Agregar opción para imageUrl
}

function FilePreview({ file, imageUrl }: FilePreviewProps) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt="Preview"
        width={48}
        height={48}
        loading="lazy"
        className="aspect-square shrink-0 rounded-md object-cover"
      />
    );
  }

  if (file && file.type.startsWith("image/") && hasFilePreview(file)) {
    return (
      <Image
        src={file.preview}
        alt={file.name}
        width={48}
        height={48}
        loading="lazy"
        className="aspect-square shrink-0 rounded-md object-cover"
      />
    );
  }

  return (
    <FileTextIcon
      className="size-10 text-muted-foreground"
      aria-hidden="true"
    />
  );
}

const FileCard: React.FC<FileCardProps> = ({ file, imageUrl, progress, onRemove }) => {
  return (
    <div className="relative flex items-center gap-2.5">
      <div className="flex flex-1 gap-2.5">
        {/* Mostrar preview de archivo o de URL */}
        {(file || imageUrl) ? (
          <FilePreview file={file} imageUrl={imageUrl} />
        ) : null}
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-px">
            <p className="line-clamp-1 text-sm font-medium text-foreground/80">
              {file ? file.name : (imageUrl?.split("/").pop() || "")}
            </p>
            {file ? (
              <p className="text-xs text-muted-foreground">
                {formatBytes(file.size)}
              </p>
            ) : null}
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7 border-transparent dark:border-red-500/10 bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400 hover:bg-red-100/80 dark:hover:bg-red-500/20"
          onClick={onRemove}
        >
          <Cross2Icon className="size-4" aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  );
};

export default FileCard;
