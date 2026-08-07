"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";

const dateOptions = [
  { label: "All time", value: "" },
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

const OrderFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const paid = searchParams.get("paid");
  const delivered = searchParams.get("delivered");
  const dateRange = searchParams.get("dateRange") ?? "";

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // reset pagination when filters change
    router.push(`/admin/orders?${params.toString()}`);
  };

  const activeCount = [paid, delivered, dateRange].filter(Boolean).length;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Status filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={
              paid || delivered
                ? "border-accent text-accent"
                : "border-border text-muted-foreground"
            }
          >
            Status <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuCheckboxItem
            checked={paid === "true"}
            onCheckedChange={(checked) =>
              updateParam("paid", checked ? "true" : null)
            }
          >
            Paid
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={paid === "false"}
            onCheckedChange={(checked) =>
              updateParam("paid", checked ? "false" : null)
            }
          >
            Not Paid
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={delivered === "true"}
            onCheckedChange={(checked) =>
              updateParam("delivered", checked ? "true" : null)
            }
          >
            Delivered
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={delivered === "false"}
            onCheckedChange={(checked) =>
              updateParam("delivered", checked ? "false" : null)
            }
          >
            Pending Delivery
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Date filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={
              dateRange
                ? "border-accent text-accent"
                : "border-border text-muted-foreground"
            }
          >
            Order date <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {dateOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              onSelect={() => updateParam("dateRange", opt.value)}
              className={
                dateRange === opt.value ? "text-accent font-medium" : ""
              }
            >
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Clear all */}
      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/orders")}
          className="text-muted-foreground"
        >
          <X className="h-3 w-3" /> Clear filters
        </Button>
      )}
    </div>
  );
};

export default OrderFilters;
