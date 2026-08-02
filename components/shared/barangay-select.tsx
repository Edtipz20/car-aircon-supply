"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, ChevronsUpDown, Loader } from "lucide-react";
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
import { getBarangaysByCity } from "@/lib/actions/location.action";

const BarangaySelect = ({
  cityCode,
  value,
  onChange,
}: {
  cityCode?: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [barangays, setBarangays] = useState<{ code: string; name: string }[]>(
    [],
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!cityCode) {
      startTransition(() => {
        setBarangays([]);
      });
      return;
    }

    startTransition(async () => {
      const result = await getBarangaysByCity(cityCode);
      setBarangays(result);
    });
  }, [cityCode]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={!cityCode}
          className="w-full h-14 justify-between font-normal"
        >
          {value || (cityCode ? "Select barangay..." : "Select a city first")}
          {isPending ? (
            <Loader className="h-4 w-4 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search barangay..." />
          <CommandList>
            <CommandEmpty>
              {isPending ? "Loading..." : "No barangay found."}
            </CommandEmpty>
            <CommandGroup>
              {barangays.map((barangay) => (
                <CommandItem
                  key={barangay.code}
                  value={barangay.name}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === barangay.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {barangay.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BarangaySelect;
