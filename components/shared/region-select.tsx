"use client";

import { useEffect, useState } from "react";
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
import { getProvinces } from "@/lib/actions/location.action";

const RegionSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (name: string, code: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [provinces, setProvinces] = useState<{ code: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProvinces().then((data) => {
      setProvinces(data);
      setLoading(false);
    });
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full h-14 justify-between font-normal"
        >
          {value || "Select region..."}
          {loading ? (
            <Loader className="h-4 w-4 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search region..." />
          <CommandList>
            <CommandEmpty>
              {loading ? "Loading..." : "No region found."}
            </CommandEmpty>
            <CommandGroup>
              {provinces.map((province) => (
                <CommandItem
                  key={province.code}
                  value={province.name}
                  onSelect={(currentValue) => {
                    if (currentValue === value) {
                      onChange("", "");
                    } else {
                      onChange(currentValue, province.code);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === province.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {province.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default RegionSelect;
