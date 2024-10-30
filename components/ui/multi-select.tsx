'use client';

import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Option {
  key: string;
  value: string;
}

interface MultiSelectProps {
  values: Option[];
  selected?: string[];
  onChange?: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  maxDisplay?: number;
  className?: string;
  error?: boolean;
}

export default function MultiSelect({
  values = [],
  selected = [],
  onChange,
  disabled = false,
  placeholder = "Seleccionar opciones",
  maxDisplay = 2,
  className,
  error = false,
}: MultiSelectProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>(selected);
  const [isOpen, setIsOpen] = useState(false);

  // Sync internal state with external selected prop
  useEffect(() => {
    setSelectedItems(selected || []);
  }, [selected]);

  const handleSelectChange = (key: string) => {
    let newSelected: string[];
    if (selectedItems.includes(key)) {
      newSelected = selectedItems.filter((item) => item !== key);
    } else {
      newSelected = [...selectedItems, key];
    }
    setSelectedItems(newSelected);
    onChange?.(newSelected);
  };

  const getSelectedLabels = () => {
    const selectedOptions = values.filter((option) =>
      selectedItems.includes(option.key)
    );
    if (selectedOptions.length === 0) {
      return placeholder;
    }
    if (selectedOptions.length <= maxDisplay) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <Badge
              key={option.key}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {option.value}
            </Badge>
          ))}
        </div>
      );
    }
    return (
      <div className="flex flex-wrap gap-1">
        {selectedOptions.slice(0, maxDisplay).map((option) => (
          <Badge
            key={option.key}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {option.value}
          </Badge>
        ))}
        <Badge variant="secondary">
          +{selectedOptions.length - maxDisplay} más
        </Badge>
      </div>
    );
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn(
            "w-full justify-between hover:bg-background",
            error && "border-destructive",
            className
          )}
        >
          <div className="flex flex-1 items-center gap-2 truncate">
            {getSelectedLabels()}
          </div>
          <div className="flex items-center gap-2 border-l pl-2 ml-2">
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)]"
        align="start"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Opciones</span>
          {selectedItems.length > 0 && (
            <Badge variant="secondary">
              {selectedItems.length} seleccionado{selectedItems.length !== 1 && "s"}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {values.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.key}
            checked={selectedItems.includes(option.key)}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={() => handleSelectChange(option.key)}
            className="gap-2"
          >
            <div className="flex items-center gap-2 flex-1">
              {option.value}
              {selectedItems.includes(option.key) && (
                <Check className="h-4 w-4 ml-auto" />
              )}
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
