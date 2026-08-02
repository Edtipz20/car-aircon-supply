"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import NavLinks from "./navlinks";

const Menu = () => {
  return (
    <nav className="lg:hidden sm:py-2">
      <Sheet>
        <SheetTrigger className="align-middle">
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col item-start p-4">
          <SheetTitle></SheetTitle>
          <SheetDescription></SheetDescription>
          <NavLinks className="flex flex-col pt-6 text-2xl gap-3" />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Menu;
