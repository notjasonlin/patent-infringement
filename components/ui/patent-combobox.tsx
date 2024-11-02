"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Patent } from "@/types";

interface PatentComboboxProps {
  patents: Patent[];
  selectedPatent: Patent | null;
  onSelect: (patent: Patent) => void;
  onSearch: (query: string) => Promise<void>;
}

export function PatentCombobox({
  patents,
  selectedPatent,
  onSelect,
  onSearch,
}: PatentComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [hasSearched, setHasSearched] = React.useState(false);

  return (
    <Popover 
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          setHasSearched(false);
          onSearch("");
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedPatent?.publication_number ?? "Search for a patent..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        side="bottom"
        align="start" 
        className="p-0" 
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        sideOffset={4}
      >
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search patents..." 
            onValueChange={(search) => {
              setHasSearched(true);
              onSearch(search);
              setOpen(true);
            }}
            className="h-9"
          />
          {hasSearched && patents.length === 0 && (
            <CommandEmpty>No patents found.</CommandEmpty>
          )}
          <CommandGroup className="max-h-[200px] overflow-y-auto">
            {patents.map((patent) => (
              <div
                key={patent.id}
                className="px-2 py-1.5 cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center text-sm"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onSelect(patent);
                  setOpen(false);
                }}
                role="option"
                aria-selected={selectedPatent?.id === patent.id}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedPatent?.id === patent.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{patent.publication_number}</span>
                  {patent.title && (
                    <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                      {patent.title}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 