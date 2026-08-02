"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.action";

const SignOutItem = () => {
  return (
    <DropdownMenuItem
      className="rounded-none focus:text-accent cursor-pointer"
      onSelect={() => {
        signOutUser();
      }}
    >
      Sign Out
    </DropdownMenuItem>
  );
};

export default SignOutItem;
