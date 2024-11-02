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

type Company = {
  id: string;
  name: string;
};

interface ComboboxProps {
  companies: Company[];
  selectedCompany: Company | null;
  onSelect: (company: Company) => void;
  onSearch: (query: string) => void;
}

export function Combobox({
  companies,
  selectedCompany,
  onSelect,
  onSearch,
}: ComboboxProps) {
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
          {selectedCompany?.name ?? "Search for a company..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search companies..." 
            onValueChange={(search) => {
              setHasSearched(true);
              onSearch(search);
              setOpen(true);
            }}
          />
          {hasSearched && companies.length === 0 && (
            <CommandEmpty>No companies found.</CommandEmpty>
          )}
          <CommandGroup>
            {companies.map((company) => (
              <div
                key={company.id}
                className="px-2 py-3 cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center"
                onClick={() => {
                  onSelect(company);
                  setOpen(false);
                }}
                role="option"
                aria-selected={selectedCompany?.id === company.id}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCompany?.id === company.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {company.name}
              </div>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 