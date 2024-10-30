import React, { useState, useRef } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, ...props }, ref) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const internalRef = useRef<HTMLInputElement | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setFileName(file.name);
      }
      if (onChange) {
        onChange(event);
      }
    };

    const handleDelete = () => {
      setFileName(null);
      if (internalRef.current) {
        internalRef.current.value = '';
      }
    };

    return (
      <div className="space-y-2">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={(node) => {
            // Handle the ref passed to forwardRef
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            // Set our internal ref
            internalRef.current = node;
          }}
          onChange={handleChange}
          {...props}
        />
        {fileName && (
          <div className="flex items-center justify-between  p-2 rounded-md">
            <span className="text-sm truncate">{fileName}</span>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              aria-label="Eliminar archivo"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };