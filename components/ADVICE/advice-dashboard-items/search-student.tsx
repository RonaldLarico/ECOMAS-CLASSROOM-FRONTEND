import * as React from "react";
import { Input } from "@/components/ui/input";

export function SearchStudent() {
  return (
    <Input
      placeholder="Buscar participante..."
      className="w-full max-w-sm"
    />
  );
}
