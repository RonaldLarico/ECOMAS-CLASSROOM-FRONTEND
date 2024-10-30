"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  onSelect: (value: string) => void;
  onInputChange: (value: string) => void;
  value: string;
  isLoading?: boolean;
}

export function Combobox({
  options,
  placeholder,
  onSelect,
  onInputChange,
  value,
  isLoading = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState<string | null>(null);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="max-w-full w-auto justify-between items-center text-ellipsis overflow-hidden whitespace-nowrap"
        >
          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedLabel ? selectedLabel : placeholder}
          </span>
          <CaretSortIcon className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 max-w-full w-auto break-words">
        <Command>
          <CommandInput
            placeholder={placeholder}
            className="h-9"
            value={value}
            onValueChange={onInputChange}
          />
          <CommandList>
            {isLoading ? (
              <p>Buscando...</p>
            ) : (
              <>
                <CommandEmpty>No hay resultados.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        onSelect(option.value);
                        setSelectedLabel(option.label);
                        setOpen(false);
                      }}
                    >
                      {option.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
