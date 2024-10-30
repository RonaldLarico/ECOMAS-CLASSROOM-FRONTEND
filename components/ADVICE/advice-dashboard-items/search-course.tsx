import * as React from "react";
import { Input } from "@/components/ui/input";

export function SearchCourse() {
  return (
    <Input
      placeholder="Buscar curso..."
      className="w-full max-w-72"
    />
  );
}
