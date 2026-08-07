"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminNav = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const isProductsSection =
    pathname.startsWith("/admin/products") ||
    pathname.startsWith("/admin/categories");

  const [productsOpen, setProductsOpen] = useState(isProductsSection);

  // Keep the group expanded if you're already on a related page,
  // even after navigating between Products <-> Categories
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isProductsSection) setProductsOpen(true);
  }, [isProductsSection]);

  return (
    <nav className={cn("flex flex-col gap-1 text-sm text-white", className)}>
      <Link
        href="/admin"
        className={cn(
          "flex items-center  gap-2 px-2 py-2 rounded hover:bg-muted hover:text-accent",
          pathname === "/admin" && "bg-muted font-medium text-primary",
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>

      <div>
        <button
          type="button"
          onClick={() => setProductsOpen((prev) => !prev)}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-2 py-2 hover:bg-muted hover:text-accent cursor-pointer",
            isProductsSection && "font-medium",
          )}
        >
          <span className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Products
          </span>
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform",
              productsOpen && "rotate-180",
            )}
          />
        </button>

        {productsOpen && (
          <div className="ml-6 mt-1 flex flex-col gap-1 border-l border-border pl-3">
            <Link
              href="/admin/products"
              className={cn(
                "px-2 py-1.5 rounded hover:bg-muted hover:text-accent",
                pathname.startsWith("/admin/products") &&
                  "text-accent font-medium",
              )}
            >
              All Products
            </Link>
            <Link
              href="/admin/categories"
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted hover:text-accent",
                pathname.startsWith("/admin/categories") &&
                  "text-accent font-medium",
              )}
            >
              <Tag className="h-3.5 w-3.5" />
              Categories
            </Link>
          </div>
        )}
      </div>

      <Link
        href="/admin/orders"
        className={cn(
          "flex items-center gap-2 px-2 py-2 rounded hover:bg-muted hover:text-accent",
          pathname.startsWith("/admin/orders") &&
            "bg-muted font-medium text-accent",
        )}
      >
        <ShoppingCart className="h-4 w-4" />
        Orders
      </Link>
    </nav>
  );
};

export default AdminNav;
