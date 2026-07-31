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
import { getCitiesByProvince } from "@/lib/actions/location.action";

const CitySelect = ({
  provinceCode,
  value,
  onChange,
}: {
  provinceCode?: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<{ code: string; name: string }[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!provinceCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCities([]);
      return;
    }

    startTransition(async () => {
      const result = await getCitiesByProvince(provinceCode);
      setCities(result);
    });
  }, [provinceCode]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={!provinceCode}
          className="w-full h-14 justify-between font-normal"
        >
          {value || (provinceCode ? "Select city..." : "Select a region first")}
          {isPending ? (
            <Loader className="h-4 w-4 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search city..." />
          <CommandList>
            <CommandEmpty>
              {isPending ? "Loading..." : "No city found."}
            </CommandEmpty>
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.code}
                  value={city.name}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CitySelect;
