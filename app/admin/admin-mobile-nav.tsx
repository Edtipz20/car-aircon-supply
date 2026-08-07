"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, MenuIcon } from "lucide-react";
import Logo from "@/components/shared/header/logo";
import AdminNav from "./admin-nav";
import { signOutUser } from "@/lib/actions/user.action";

const AdminMobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <MenuIcon className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-5">
        <SheetTitle></SheetTitle>
        <SheetDescription></SheetDescription>

        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <AdminNav className="text-lg" />

        <form
          action={signOutUser}
          className="mt-auto pt-4 border-t border-border"
        >
          <button
            type="submit"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileNav;
